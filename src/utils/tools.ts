import { vuetifyComponentsImporter, vueUseComponentsImporter } from '../tools/index.ts';

/**
 * List of CLI option values that represent supported tool runners.
 *
 * Each entry is expected as the full tool name passed by the user (e.g. "vuetify-importer").
 * The code uses this array to validate CLI input before attempting to resolve a tool.
 */
export const possibleTools = ['vuetify-importer', 'vueuse-importer'];

/**
 * Check if a provided tool string is one of the supported `possibleTools`.
 *
 * @param tool - raw tool identifier provided by the user (e.g. "vuetify-importer")
 * @returns true when the tool is supported, false otherwise
 */
export function isPossibleTool(tool: string) {
  return possibleTools.includes(tool);
}

/**
 * Derive the canonical tool key used in the `tools` map from the raw tool name.
 *
 * The convention is that the tool name is hyphen-separated and the first segment
 * represents the tool key (e.g. "vuetify-importer" -> "vuetify").
 *
 * @param tool - raw tool identifier provided by the user
 * @returns the first segment of the tool string used as lookup key
 */
export function getToolName(tool: string) {
  return tool.split('-')[0];
}

/**
 * Mapping from canonical tool keys to their importer functions.
 *
 * The importer functions are invoked by the CLI flow to produce tag lists or
 * perform tool-specific operations. Keys must match the values produced by
 * `getToolName`.
 */
export const tools = {
  vuetify: vuetifyComponentsImporter,
  vueuse: vueUseComponentsImporter
};
