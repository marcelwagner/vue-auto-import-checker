import getUnknownTags from './src/getUnknownTags.ts';
import type { VAIC_Config } from './types/config.interface.ts';

export default async function (config: VAIC_Config) {
  return getUnknownTags(config);
};

export * as getUnknownTags from './src/getUnknownTags.ts';
export * from './src/plugins/componentList.ts';
export * from './src/plugins/htmlTags.ts';
export * from './src/plugins/vuetifyTags.ts';
