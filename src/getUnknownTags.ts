import fsPromise from 'node:fs/promises';
import path from 'node:path';

import type { VAIC_Config } from '../types/config.interface.ts';
import { getComponentList } from './getComponentList.ts';
import {
  addToUnknownTags,
  getCustomTagList,
  getFileContent,
  getJsonFileContent,
  getTagFromLine,
  isTagInIgnoreList
} from './utils/index.ts';

/**
 * Scan a project directory for unknown component tags used inside template blocks.
 *
 * Workflow:
 * - Read configuration and prepare auxiliary lists (components, custom tags, tags from plugins).
 * - Walk the project directory recursively and inspect each file.
 * - For files containing a `<template>` section, parse line-by-line while skipping `<script>` and `<style>` regions.
 * - Extract candidate tags from each line, normalize them and check against ignore lists and registered components.
 * - Collect and return a summary including stats, found unknown tags and the component list.
 *
 * @param config - configuration object adhering to `VAIC_Config`
 * @returns Promise resolving to `ComponentSearch` containing `stats`, `unknownTags` and `componentsList`
 */
export default async function ({
  componentsFile,
  projectPath,
  userGeneratedPath,
  noHtml,
  noSvg,
  noVue,
  noVueRouter,
  vueUse,
  vuetify,
  customTags,
  customTagsFile,
  quiet,
  basePath
}: VAIC_Config): Promise<ComponentSearch> {
  /**
   * Process a single file: read content, detect template sections and collect unknown tags.
   *
   * - Increments file counters on each invocation.
   * - Skips files without a `<template>` section.
   * - Tracks whether current parsing position is inside `<script>` or `<style>` blocks to avoid false positives.
   * - Uses `getTagFromLine` to find candidate tags and validates them against ignore lists and known components.
   */
  const getUnknownTagsFromFile = async (file: string, stats: Stats, unknownTags: UnknownTags[]) => {
    stats.fileCounter++;

    const fileContent = await getFileContent(file);

    // Quick check whether this file contains a template at all.
    const isTemplate = fileContent.includes('<template>');

    if (!isTemplate) {
      return;
    }

    stats.templateFiles++;

    // Track whether the current line is inside a script or style block to skip them.
    let script = false;
    let style = false;

    // Split file into lines for indexed reporting.
    const linesOfFile = fileContent.split(/\n/);

    linesOfFile.forEach((line: string, index: number) => {
      // Enter script block
      if (line.match(/<script[\w\W]*/)) {
        script = true;

        if (style) {
          style = false;
        }
      }

      // Exit script block
      if (line.match(/<\/script>/)) {
        script = false;
      }

      // Enter style block
      if (line.match(/<style[\w\W]*/)) {
        style = true;

        if (script) {
          script = false;
        }
      }

      // Exit style block
      if (line.match(/<\/style>/)) {
        style = false;
      }

      // Skip lines that are inside script or style sections
      if (script || style) {
        return;
      }

      // Extract candidate tags from the template line
      const tagListRaw = getTagFromLine(line);

      // No matching tag found in line
      if (tagListRaw.length <= 0) {
        return;
      }

      tagListRaw.forEach((tagRaw: string) => {
        // Normalize for comparison by removing hyphens and lowercasing
        const tag = tagRaw.replace(/-/g, '').toLowerCase();

        const ignoreListConfig: IgnoreListConfig = {
          noHtml,
          noSvg,
          noVue,
          noVueRouter,
          customVuetifyTags,
          customVueUseTags,
          customTags,
          customTagsFileContent
        };

        // If the tag is present in the computed ignore lists, skip it
        if (isTagInIgnoreList(tag, ignoreListConfig)) {
          return;
        }

        // If tag matches any known component tag, skip it
        if (componentsList.map(component => component.tag).includes(tag)) {
          return;
        }

        // Otherwise the tag is unknown — record it with context
        addToUnknownTags(unknownTags, index, tagRaw, linesOfFile, file);
      });
    });

    return;
  };

  /**
   * Recursively traverse a directory, invoking `getUnknownTagsFromFile` for each file.
   *
   * - Updates directory counters.
   * - Recurses into subdirectories.
   * - Handles file system errors by rejecting unless `quiet` is enabled.
   */
  const getUnknownTagsFromDirectory = async (
    directoryPath: string,
    stats: Stats,
    unknownTags: UnknownTags[]
  ) => {
    stats.dirCounter++;

    const entries = await fsPromise.readdir(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directoryPath, entry.name);

      if (entry.isFile()) {
        // Process file
        try {
          await getUnknownTagsFromFile(fullPath, stats, unknownTags);
        } catch (error) {
          if (!quiet) {
            return Promise.reject({
              errorText: `Error reading file ${fullPath}: ${JSON.stringify(error)}`
            });
          }
        }
      } else if (entry.isDirectory()) {
        // Recursive call for subfolders
        try {
          await getUnknownTagsFromDirectory(fullPath, stats, unknownTags);
        } catch (error) {
          if (!quiet) {
            return Promise.reject({
              errorText: `Error reading path ${fullPath}: ${JSON.stringify(error)}`
            });
          }
        }
      } else {
        // Other entry types (symlinks, sockets) are ignored
      }
    }
  };

  // Record start time for stats and performance measurement
  const startTime = Date.now();

  const stats: Stats = {
    fileCounter: 0,
    dirCounter: 0,
    templateFiles: 0,
    startTime,
    endTime: startTime
  };

  const unknownTags: UnknownTags[] = [];

  // Load optional tag lists (vue-use and vuetify) from user or fallback plugin locations
  const customVuetifyTags = vuetify
    ? await getCustomTagList(userGeneratedPath, basePath, 'vuetifyTags')
    : null;

  const customVueUseTags = vueUse
    ? await getCustomTagList(userGeneratedPath, basePath, 'vueUseTags')
    : null;

  // Load a custom tags JSON file if provided
  const customTagsFileContent = customTagsFile ? await getJsonFileContent(customTagsFile) : [];

  // Build the list of registered components to exclude them from unknowns
  const componentsList = await getComponentList(componentsFile);

  // Start recursive scan of the project directory
  await getUnknownTagsFromDirectory(projectPath, stats, unknownTags);

  // Finalize timing
  stats.endTime = Date.now();

  // Return aggregated results
  return {
    stats,
    unknownTags,
    componentsList
  };
}
