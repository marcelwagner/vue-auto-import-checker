import getUnknownTags from './src/getUnknownTags';
import type { VAIC_Config } from './types/config.interface';

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
export default async function (config: VAIC_Config) {
  return getUnknownTags(config);
}

export * from './src/getComponentList';
export * from './src/tools/index';
export * from './src/utils/index';
