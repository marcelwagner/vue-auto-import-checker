import { htmlTags } from '../plugins/htmlTags.ts';
import { svgTags } from '../plugins/svgTags.ts';
import { default as vueRouterTags } from '../plugins/vueRouterTags.json';
import { default as vueTags } from '../plugins/vueTags.json';
import { default as vuetifyTags } from '../plugins/vuetifyTags.json';
import { default as vueUseTags } from '../plugins/vueUseTags.json';

/**
 * Determine whether a given tag should be ignored according to the provided configuration.
 *
 * Behavior:
 * - Build a combined ignore list from multiple sources (HTML, SVG, Vue, router, Vuetify, vue-use, custom lists).
 * - Normalize entries by removing dashes and lowercasing when comparing.
 *
 * @param tag - the tag name to check (expected to be already normalized, e.g. lowercase)
 * @param config - configuration object containing toggles and tag lists to include/exclude
 * @returns boolean - true if the tag is present in the computed ignore list
 */
export function isTagInIgnoreList(
  tag: string,
  {
    noHtml,
    noSvg,
    noVue,
    noVueRouter,
    customVuetifyTags,
    customVueUseTags,
    customTags,
    customTagsFileContent
  }: IgnoreListConfig
) {
  // Compose the final ignored tags list from the enabled sources.
  const ignoredTagsList = [
    ...(!noHtml ? (htmlTags as string[]) : []),
    ...(!noSvg ? svgTags : []),
    ...(!noVue ? vueTags : []),
    ...(!noVueRouter ? vueRouterTags : []),
    ...(customVuetifyTags ? customVuetifyTags : vuetifyTags),
    ...(customVueUseTags ? customVueUseTags : vueUseTags),
    ...customTags,
    ...customTagsFileContent
  ];

  if (ignoredTagsList.length >= 1) {
    // Compare each candidate after removing hyphens and lowercasing.
    return ignoredTagsList.some(tagFromList => tagFromList.replace(/-/g, '').toLowerCase() === tag);
  }

  // No ignore patterns configured
  return false;
}

/**
 * Check whether a tag matches one of the capture groups from a regex match result.
 *
 * @param tag - the tag to compare
 * @param regexMatchResult - RegExpMatchArray or null returned by `String.prototype.match`
 * @returns boolean - true if any captured group equals the provided tag
 */
export function matchesOneOf(tag: string, regexMatchResult: RegExpMatchArray | null) {
  return regexMatchResult ? regexMatchResult.some((result: string) => result === tag) : false;
}

/**
 * Extract valid tag names from a single line of template/source text.
 *
 * Behavior:
 * - Find candidate opening tags using a simple `<([\w-]+)` pattern.
 * - For each candidate, perform additional heuristics to avoid false positives:
 *   - Detect complete tag tokens and skip quirks (links, inline fragments).
 *   - Detect property/event typing or nested `<`/`>` sequences that look like tags but are not.
 * - Return an array of cleaned tag names (no leading `<`, trimmed).
 *
 * @param line - a single line of text from a file
 * @returns string[] - list of validated tag names found in the line
 */
export function getTagFromLine(line: string) {
  // Find raw tag-like tokens such as "<my-tag"
  const tagListRaw = line.match(/<([\w-]+)/g);

  // No tag-like token present
  if (tagListRaw === null) {
    return [];
  }

  return tagListRaw
    .map(tag => tag.replace(/</, '').trim())
    .filter(tag => {
      // Attempt to find a full opening tag to compare with the raw candidate.
      const completeTag = line.match(/<([\w]+?[^ ]+?)[\W]*?>/);

      // If the complete tag contains stray angle brackets it's likely malformed/multiple tags.
      const multipleTags = completeTag?.[1].includes('>') || completeTag?.[1].includes('<');

      // Detect an explicit closing tag on the same line.
      const endTag = line.match(/<\/([a-zA-Z0-9-_]+)>/);

      // Detect constructs where a "<" appears inside a property or a typed expression,
      // which can be mistaken for an actual tag.
      const propertyTyping = line.match(
        /[=:"]+?[^</]+?<\s*([a-zA-Z0-9-_]+)\s*(?=>)|[=:"]+?[^</]+?<([a-zA-Z0-9-_]*?)<\s*?\W*?([a-zA-Z0-9-_]+?)\W*?\s*?>/
      );

      // Exclude candidates that are quirks, inline fragments, or matched by property typing.
      if (
        // Candidate matches a quirks Tag, a link or a not propper written tag (false positive)
        (completeTag !== null &&
          tag !== completeTag?.[1] &&
          !multipleTags &&
          endTag === null &&
          propertyTyping === null) ||
        // Candidate matches a property/event typing capture (false positive)
        matchesOneOf(tag, propertyTyping)
      ) {
        return false;
      }

      // Candidate looks like a valid tag
      return true;
    });
}

/**
 * Get a small context (previous, current, next) of lines around a given index for reporting.
 *
 * Note: `linesOfFile` is expected to be an array of file lines (zero-based). The `index` parameter
 * is used as a zero-based line pointer. The returned objects include `text` and a 1-based `index`
 * field suitable for presentation.
 *
 * @param linesOfFile - array of file lines
 * @param index - current zero-based line index
 * @returns UnknownTagLine[] - up to three lines of context with their display indices
 */
export function getLinesForReport(linesOfFile: string[], index: number): UnknownTagLine[] {
  return [
    ...(index - 1 >= 1 ? [{ text: linesOfFile[index - 1], index: index }] : []),
    { text: linesOfFile[index], index: index + 1 },
    ...(index + 1 <= linesOfFile.length ? [{ text: linesOfFile[index + 2], index: index + 1 }] : [])
  ];
}

/**
 * Append an unknown tag occurrence to the aggregated list with contextual information.
 *
 * @param unknownTags - accumulator array to push the new unknown tag entry into
 * @param index - zero-based line index where the tag was found
 * @param tag - the tag name that was found and considered unknown
 * @param linesOfFile - full file lines for extracting context
 * @param file - file path where the unknown tag was found
 */
export function addToUnknownTags(
  unknownTags: UnknownTags[],
  index: number,
  tag: string,
  linesOfFile: string[],
  file: string
) {
  unknownTags.push({
    line: index + 1,
    tagName: tag,
    lines: getLinesForReport(linesOfFile, index),
    file
  });
}
