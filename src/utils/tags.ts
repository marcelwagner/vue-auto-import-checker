import type { Dirent } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { vueTemplateEnd, vueTemplateStart } from '../../config.ts';
import { getBaseTags, getFileContent, getFrameworkTools, getJsonFileContent } from './index.ts';

/**
 * Process a single file and collect unknown tags.
 *
 * - Reads the file content and performs a fast check for `<template>`.
 * - Skips lines that are inside `<script>` or `<style>` blocks.
 * - Extracts candidate tags from template lines and filters them against the
 *   aggregated ignore list and the registered components list.
 *
 * @param {string} file - absolute path to the file to process
 * @param {Tag[]} tags - array to append discovered unknown tag occurrences
 * @returns {Promise<void>} resolves when the file has been processed
 */
export async function getTagsFromFile(file: string, tags: Tag[]): Promise<Tag[]> {
  stats.fileCounter++;

  const fileContent: string = await getFileContent(file);

  logger.debug(`File: ${file}`);

  // Split file into lines to provide accurate line numbers for reporting.
  const linesOfFile: string[] = fileContent.split(/\n/);

  logger.debug(`ALl lines length: ${linesOfFile.length}`);

  const templateStartIndex: number = linesOfFile.findIndex((line: string): boolean =>
    line.trim().includes(vueTemplateStart)
  );
  const templateEndIndex: number = linesOfFile.findLastIndex((line: string): boolean =>
    line.trim().includes(vueTemplateEnd)
  );

  if (templateStartIndex === -1) {
    logger.debug(`Did not find ${vueTemplateStart}`);
    return tags;
  }

  stats.templateFiles++;

  logger.debug(`Index of first ${vueTemplateStart}: ${templateStartIndex}`);
  logger.debug(`Index of last ${vueTemplateEnd}: ${templateEndIndex}`);

  const tagList: string[][] = getTagsFromTemplate(
    linesOfFile,
    templateStartIndex,
    templateEndIndex
  );

  const imports: ComponentImport[] = getImportsFromFile(fileContent);

  tagList.forEach((tagListRaw: string[], index: number): void => {
    tagListRaw.forEach((tagRaw: string): void => {
      const componentMatch: ComponentImport | undefined = imports.find(
        (imp: ComponentImport): boolean =>
          imp.component.some((comp: string): boolean => normalizeTag(comp) === normalizeTag(tagRaw))
      );

      tags.push({
        line: index + 1,
        tagName: tagRaw,
        lines: getLinesForReport(linesOfFile, index),
        file,
        known: false,
        knownSource: componentMatch
          ? [{ source: 'import' as Source, known: true, file: componentMatch.path }]
          : []
      });
    });
  });

  return tags;
}

/**
 * Recursively traverse a directory and process each file.
 *
 * - Increments directory counters.
 * - For each filesystem entry: if file -> process via `getTagsFromFile`, if directory -> recurse.
 * - Errors while reading files/directories are converted to rejected Promises unless `quiet` is enabled,
 *   in which case they are swallowed to continue best-effort scanning.
 * - Symlinks and non-file/directory entries are ignored.
 *
 * @param basePath - base path to resolve relative paths against
 * @param {Tag[]} tags - array to append discovered unknown tag occurrences
 * @param {string} directoryPath - path of the directory to traverse
 * @returns {Promise<void>} resolves when the directory and its children have been processed
 */
export async function getTagsFromDirectory(
  basePath: string,
  directoryPath: string,
  tags: Tag[]
): Promise<Tag[]> {
  stats.dirCounter++;

  const directory = join(basePath, directoryPath);

  logger.debug(`Dir: ${directory}`);

  const entries: Dirent<string>[] = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(directory, entry.name);

    if (entry.isFile()) {
      // Process file and surface errors unless quiet mode is enabled.
      try {
        await getTagsFromFile(fullPath, tags);
      } catch (error) {
        if (!quiet) {
          return Promise.reject({
            errorText: `Error getting Tags from file ${fullPath}: ${JSON.stringify(error)}`
          });
        }
      }
    } else if (entry.isDirectory()) {
      // Recurse into subdirectories.
      try {
        await getTagsFromDirectory(basePath, join(directoryPath, entry.name), tags);
      } catch (error) {
        if (!quiet) {
          return Promise.reject({
            errorText: `Error getting Tags from path ${fullPath}: ${JSON.stringify(error)}`
          });
        }
      }
    } else {
      // Other entry types (symlinks, sockets, device nodes) are ignored intentionally.
    }
  }

  return tags;
}

export async function getUnknownTagsList(tags: Tag[]): Promise<Tag[]> {
  return tags.filter((tag: Tag): boolean => {
    const tagName = normalizeTag(tag.tagName);

    if (!tag.known) {
      logger.debug(`tag ${tagName} is unknown`);
      return true;
    }

    // Skip tag if it is known
    logger.debug(`tag ${tagName} is known`);
    return false;
  });
}

export async function getIdentifiedTags(
  knownTagsList: KnownList[],
  componentsList: string[],
  componentsFile: string,
  tags: Tag[],
  importsKnown: boolean
): Promise<Tag[]> {
  return tags.map((tag: Tag): Tag => {
    return identifyTag(knownTagsList, componentsList, componentsFile, tag, importsKnown);
  });
}

/**
 * Build the aggregated known list from framework plugins, user-supplied tags and the JSON file.
 *
 * @param negateKnown - whether to negate the known tags list (e.g. exclude known tags)
 * @param knownFrameworks - list of known frameworks from cli
 * @param knownTags - list of known tags from cli
 * @param knownTagsFileContent - content of the JSON file containing known tags
 * @param cachePath - path to the user-generated JSON file
 * @returns Promise resolving to an array of KnownList objects representing the aggregated known tags and their sources
 */
export async function getKnownLists({
  negateKnown,
  knownFrameworks,
  knownTags,
  knownTagsFile,
  cachePath
}: KnownListConfig): Promise<KnownList[]> {
  const knownTagsFileContent: string[] = knownTagsFile
    ? await getJsonFileContent(knownTagsFile)
    : [];
  const knownTagsFileContentList: KnownList[] =
    knownTagsFileContent.length >= 1
      ? [
          {
            name: 'file' as Source,
            tags: knownTagsFileContent,
            known: true,
            file: knownTagsFile
          }
        ]
      : [];
  const knownTagsList: KnownList[] =
    knownTags.length >= 1
      ? [{ name: 'cli' as Source, tags: knownTags, known: true, file: '' }]
      : [];
  const baseTags: KnownList[] = getBaseTags(negateKnown);
  const frameworkTags: KnownList[] = await getFrameworkTools(knownFrameworks, cachePath);

  logger.debug(`baseTags: ${JSON.stringify(baseTags, null, 2)}`);
  logger.debug(`frameworkTags: ${JSON.stringify(frameworkTags, null, 2)}`);
  logger.debug(`knownTagsList: ${JSON.stringify(knownTagsList, null, 2)}`);
  logger.debug(`knownTagsFileContentList: ${JSON.stringify(knownTagsFileContentList, null, 2)}`);

  return [...knownTagsList, ...knownTagsFileContentList, ...frameworkTags, ...baseTags];
}

/**
 * Normalize a tag name by removing hyphens and converting to lowercase.
 * @param tag - the tag name to normalize
 * @returns string - normalized tag name
 * @example normalizeTag('my-button') // 'mybutton'
 * @example normalizeTag('my_button') // 'mybutton'
 * @example normalizeTag('MyButton') // 'mybutton'
 */
export function normalizeTag(tag: string): string {
  return tag.replace(/-/g, '').replace(/_/g, '').toLowerCase();
}

/**
 * Check whether a tag matches one of the known lists and set its `source` and `known` flags accordingly.
 *
 * @param listOfKnownLists - configuration object containing toggles and tag lists to include/exclude
 * @param componentsList - list of registered component tags
 * @param componentsFile - path to the JSON file containing component tags
 * @param tag - the tag name to check
 * @returns Tag - the input tag with updated `knownSource` field
 */
export function identifyTag(
  listOfKnownLists: KnownList[],
  componentsList: string[],
  componentsFile: string,
  tag: Tag,
  importsKnown: boolean
): Tag {
  const tagName: string = normalizeTag(tag.tagName);

  if (listOfKnownLists.length >= 1) {
    // Compare each candidate after removing hyphens and lowercasing.
    const knownLists: KnownList[] = listOfKnownLists.filter((list: KnownList): boolean =>
      list.tags.some((tagFromList: string): boolean => normalizeTag(tagFromList) === tagName)
    );

    if (tag.knownSource.length >= 1) {
      tag.knownSource.forEach(knownSource => {
        if (knownSource.source === 'import' && importsKnown) {
          knownSource.known = true;
          tag.known = true;
        }
      });
    }

    if (knownLists.length >= 1) {
      knownLists.forEach((list: KnownList): void => {
        tag.knownSource.push({ source: list.name, known: list.known, file: list.file });

        if (list.known) {
          tag.known = true;
        }
      });

      logger.debug(`tag ${tagName} is in known list`);
    }
  }

  if (componentsList.length >= 1) {
    if (componentsList.some((rawTag: string): boolean => normalizeTag(rawTag) === tagName)) {
      tag.knownSource.push({ source: 'components', known: true, file: componentsFile });
      tag.known = true;

      logger.debug(`tag ${tagName} is in components list`);
    }
  }

  if (tag.knownSource.length <= 0) {
    tag.knownSource.push({ source: 'unknown', known: false, file: '' });

    logger.debug(`tag ${tagName} is not in components list or in a known list`);
  }

  return tag;
}

/**
 * Check whether a tag matches one of the capture groups from a regex match result.
 *
 * @param tag - the tag to compare
 * @param regexMatchResult - RegExpMatchArray or null returned by `String.prototype.match`
 * @returns boolean - true if any captured group equals the provided tag
 */
export function matchesOneOf(tag: string, regexMatchResult: RegExpMatchArray | null): boolean {
  return regexMatchResult ? regexMatchResult.some((result: string) => result === tag) : false;
}

/**
 * Extract component imports from a file's content.
 * @param fileContent - the content of the file to parse
 * @returns ComponentImport[] - an array of objects containing component names and paths
 * @example getImportsFromFile('import { Button } from "@/components/Button.vue";') // [{ component: ['Button'], path: '@/components/Button.vue' }]
 */
export function getImportsFromFile(fileContent: string): ComponentImport[] {
  const imports: ComponentImport[] = [];

  const importMatches: RegExpExecArray[] = [
    ...fileContent.matchAll(
      /[ ]*import [{ \n\r]*[ ]*([\w,\-\n\r ]+)[} ]* from ['"]*([@.\-/\w]+)['"]*[;]*|[ ]*import ([\w,\-\n\r ]*) [{ \n\r]*[ ]*([\w,\-\n\r ]+)[} ]* from ['"]*([@.\-/\w]+)['"]*[;]*/g
    )
  ];

  for (const match of importMatches) {
    const component: string[] = match[1]
      .replace(/as/gm, '')
      .replace(/default/gm, '')
      .replace(/,/gm, '')
      .replace(/ /gm, '')
      .replace(/\n/gm, ',')
      .split(',');
    const path: string = match[2];

    logger.debug(`Found import: ${component.join(', ')} ${path}.`);

    imports.push({ component, path });
  }

  return imports;
}

/**
 * Extract candidate tags from a template section of a file.
 *
 * @param linesOfFile - array of lines from the file
 * @param templateStartIndex - index of the first line of the template
 * @param templateEndIndex - index of the last line of the template
 * @returns string[][] - array of arrays of tag names, one for each line in the template
 */
export function getTagsFromTemplate(
  linesOfFile: string[],
  templateStartIndex: number,
  templateEndIndex: number
): string[][] {
  const tagList: string[][] = [];

  for (let index: number = templateStartIndex + 1; index <= templateEndIndex; index++) {
    const line: string = linesOfFile[index];

    logger.debug(`Line content: "${line}"`);

    // Extract candidate tags from the template line (utility handles tag parsing heuristics).
    const tagListRaw: string[] = getTagFromLine(line);

    if (tagListRaw.length >= 1) {
      logger.debug(`Tags found in line. ${tagListRaw}`);
    }

    tagList[index] = tagListRaw;
  }

  return tagList;
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
export function getTagFromLine(line: string): string[] {
  // Find raw tag-like tokens such as "<my-tag"
  const tagListRaw: RegExpMatchArray | null = line.match(/<([\w-]+)/g);

  // No tag-like token present
  if (tagListRaw === null) {
    logger.debug(`no tags found in line`);

    return [];
  }

  return tagListRaw
    .map((tag: string): string => tag.replace(/</, '').trim())
    .filter((tag: string): boolean => {
      // Attempt to find a full opening tag to compare with the raw candidate.
      const completeTag: RegExpMatchArray | null = line.match(/<([\w]+?[^ ]+?)[\W]*?>/);

      // If the complete tag contains stray angle brackets it's likely malformed/multiple tags.
      const multipleTags: boolean | undefined =
        completeTag?.[1].includes('>') || completeTag?.[1].includes('<');

      // Detect an explicit closing tag on the same line.
      const endTag: RegExpMatchArray | null = line.match(/<\/([a-zA-Z0-9-_]+)>/);

      // Detect constructs where a "<" appears inside a property or a typed expression,
      // which can be mistaken for an actual tag.
      const propertyTyping: RegExpMatchArray | null = line.match(
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
        logger.debug(`tag ${tag} is not valide`);

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
    ...(index + 1 <= linesOfFile.length ? [{ text: linesOfFile[index + 1], index: index + 2 }] : [])
  ];
}
