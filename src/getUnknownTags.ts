import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { VAIC_ComponentSearch, VAIC_Config } from '../types/config.interface.ts';
import {
  createLogger,
  getIdentifiedTagsList,
  getKnownComponentList,
  getKnownLists,
  getTagsFromDirectory,
  getUnknownTagsList
} from './utils/index.ts';

/**
 * Scan a project directory for unknown component tags used inside template blocks.
 *
 * High-level workflow:
 *  - Read configuration and prepare auxiliary known/unknown lists.
 *  - Recursively traverse `projectPath` and inspect each file.
 *  - For files that contain a `<template>` section analyze lines while skipping
 *    `<script>` and `<style>` regions to avoid false positives.
 *  - Extract candidate tags from template lines, normalize them and check
 *    against computed known/unknown lists and registered components.
 *  - Return aggregated `stats`, found `tagList` and `unknownTags` and the `componentsList`.
 *
 * @param {VAIC_Config} config - configuration object adhering to `VAIC_Config`
 * @returns {Promise<VAIC_ComponentSearch>} Promise resolving to ComponentSearch containing stats, unknownTags and componentsList
 */
export async function getUnknownTags({
  componentsFile,
  projectPath,
  negateKnown,
  knownFrameworks,
  knownTags,
  knownTagsFile,
  cachePath,
  basePath,
  importsKnown,
  debug,
  skipReturnUnknown
}: VAIC_Config): Promise<VAIC_ComponentSearch> {
  // Base path for resolving relative paths if not provided.
  const base: string = basePath ? basePath : dirname(fileURLToPath(import.meta.url));

  // Ensure a global logger exists (created with the provided debug flag).
  if (!global?.logger) {
    createLogger(Boolean(debug));
  }

  // Record start time for performance/statistics.
  const startTime: number = Date.now();

  global.stats = {
    fileCounter: 0,
    dirCounter: 0,
    templateFiles: 0,
    startTime,
    endTime: startTime
  };

  // Start the recursive scan of the project directory.
  const rawTagsList: Tag[] = await getTagsFromDirectory(base, projectPath, []);

  // Build the aggregated known list from framework plugins, base tags, user-supplied tags and user-supplied JSON file.
  const knownTagsList: KnownList[] = await getKnownLists({
    negateKnown,
    knownFrameworks,
    knownTags,
    knownTagsFile: knownTagsFile ? join(base, knownTagsFile) : '',
    cachePath: join(base, cachePath)
  });

  // Build the list of registered components to exclude them from unknown detection.
  const componentsList: string[] = componentsFile
    ? await getKnownComponentList(base, componentsFile)
    : [];

  // Run the actual tag identification logic.
  const tagsList: Tag[] = await getIdentifiedTagsList({
    knownTagsList,
    componentsList,
    componentsFile,
    tags: rawTagsList,
    importsKnown
  });

  // Run the actual unknown tag detection logic.
  const unknownTagsList: Tag[] = skipReturnUnknown ? [] : await getUnknownTagsList(tagsList);

  stats.endTime = Date.now();

  return {
    stats,
    tagsList,
    unknownTagsList,
    componentsList
  };
}
