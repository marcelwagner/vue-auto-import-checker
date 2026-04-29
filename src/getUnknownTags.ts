import { getTags } from './index.ts';
import { getErrorText, getUnknownTagsList, statistics } from './utils/index.ts';
import { userConfig } from './config/index.ts';

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
 * @param config - configuration object adhering to `VAIC_Config`
 * @returns promise resolving to ComponentSearch containing stats, unknownTags and componentsList
 */
export async function getUnknownTags(config: InternalConfig): Promise<Tag[]> {
  try {
    userConfig.set(config);

    // Start the timer.
    statistics.start();

    // Run the actual tag identification logic.
    const tagsList: Tag[] = await getTags(userConfig);

    // Run the actual unknown tag detection logic.
    const unknownTagsList: Tag[] = await getUnknownTagsList(tagsList);

    statistics.end();

    return unknownTagsList;
  } catch (error) {
    // Propagate a structured rejection so callers can handle errors consistently.
    return Promise.reject({
      errorText: `Error in getUnknownTags: ${getErrorText(error)}`
    });
  }
}
