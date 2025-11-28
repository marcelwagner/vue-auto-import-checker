import { htmlTags } from '../plugins/htmlTags.ts';
import { svgTags } from '../plugins/svgTags.ts';
import { default as vueRouterTags } from '../plugins/vueRouterTags.json';
import { default as vueTags } from '../plugins/vueTags.json';

export function isTagInIgnoreList(
  tag: string,
  { noHtml, noSvg, noVue, noVueRouter, vuetifyTags, vueUseTags, customTags }: IgnoreListConfig
) {
  // Which tags to ignore
  const ignoredTagsList = [
    ...(!noHtml ? (htmlTags as string[]) : []),
    ...(!noSvg ? svgTags : []),
    ...(!noVue ? vueTags : []),
    ...(!noVueRouter ? vueRouterTags : []),
    ...vuetifyTags,
    ...vueUseTags,
    ...customTags
  ];

  if (ignoredTagsList.length >= 1) {
    return ignoredTagsList.some(tagFromList => tagFromList.replace(/-/g, '').toLowerCase() === tag);
  }

  return false;
}

export function matchesOneOf(tag: string, regexMatchResult: RegExpMatchArray | null) {
  return regexMatchResult ? regexMatchResult.some((result: string) => result === tag) : false;
}

export function getTagFromLine(line: string) {
  // No script or style section, must be a template section
  const tagListRaw = line.match(/<([\w-]+)/g);

  // No matching tag found in line
  if (tagListRaw === null) {
    return [];
  }

  return tagListRaw
    .map(tag => tag.replace(/</, '').trim())
    .filter(tag => {
      // More checks for certainty
      const completeTag = line.match(/<([\w]+?[^ ]+?)[\W]*?>/);
      const multipleTags = completeTag?.[1].includes('>') || completeTag?.[1].includes('<');
      const endTag = line.match(/<\/([a-zA-Z0-9-_]+)>/);
      const propertyTyping = line.match(
        /[=:"]+?[^</]+?<\s*([a-zA-Z0-9-_]+)\s*(?=>)|[=:"]+?[^</]+?<([a-zA-Z0-9-_]*?)<\s*?\W*?([a-zA-Z0-9-_]+?)\W*?\s*?>/
      );

      // Event property as tag or quirks tag found
      if (
        // Quirks Tags, Links, etc...
        (completeTag !== null &&
          tag !== completeTag?.[1] &&
          !multipleTags &&
          endTag === null &&
          propertyTyping === null) ||
        // Typing inside a property or a event, looks like a tag
        matchesOneOf(tag, propertyTyping)
      ) {
        return false;
      }

      // Tag is valide
      return true;
    });
}

export function getLinesForReport(linesOfFile: string[], index: number): UnknownTagLine[] {
  return [
    ...(index - 1 >= 1 ? [{ text: linesOfFile[index - 1], index: index }] : []),
    { text: linesOfFile[index], index: index + 1 },
    ...(index + 1 <= linesOfFile.length ? [{ text: linesOfFile[index + 2], index: index + 1 }] : [])
  ];
}

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
