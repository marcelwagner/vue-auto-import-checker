import { vuetifyComponentsImporter } from '../tools/vuetifyComponentsImporter.ts';
import { vueUseComponentsImporter } from '../tools/vueUseComponentsImporter.ts';

export const possibleTools = ['vuetify-importer', 'vueuse-importer'];

export function isPossibleTool(tool: string) {
  return possibleTools.includes(tool);
}

export function getToolName(tool: string) {
  return tool.split('-')[0];
}

export const tools = {
  vuetify: vuetifyComponentsImporter,
  vueuse: vueUseComponentsImporter
};
