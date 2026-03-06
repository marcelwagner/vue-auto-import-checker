import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { VAIC_Config } from '../types/config.interface.ts';
import {
  createLogger,
  getIdentifiedTags,
  getKnownComponentList,
  getKnownLists,
  getTagsFromDirectory,
  getUnknownTagsList
} from './utils/index.ts';

/**
 * Scan a project directory for unknown component tags used inside template blocks.
 *
 * High-level workflow:
 *  - Read configuration and prepare auxiliary ignore/component lists.
 *  - Recursively traverse `projectPath` and inspect each file.
 *  - For files that contain a `<template>` section analyze lines while skipping
 *    `<script>` and `<style>` regions to avoid false positives.
 *  - Extract candidate tags from template lines, normalize them and check
 *    against computed ignore lists and registered components.
 *  - Return aggregated `stats`, found `unknownTags` and the `componentsList`.
 *
 * @param {VAIC_Config} config - configuration object adhering to `VAIC_Config`
 * @returns {Promise<ComponentSearch>} Promise resolving to ComponentSearch containing stats, unknownTags and componentsList
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
  debug
}: VAIC_Config): Promise<ComponentSearch> {
  const base = basePath ? basePath : dirname(fileURLToPath(import.meta.url));

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

  // Build the aggregated ignore list from framework plugins, user-supplied tags and the JSON file.
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

  const tagsList: Tag[] = await getIdentifiedTags(
    knownTagsList,
    componentsList,
    componentsFile,
    rawTagsList,
    importsKnown
  );

  // Run the actual unknown tag detection logic.
  const unknownTagsList: Tag[] = await getUnknownTagsList(tagsList);

  // Finalize timing.
  stats.endTime = Date.now();

  // Return aggregated results to the caller.
  return {
    stats,
    tagsList,
    unknownTagsList,
    componentsList
  };
}
