import getUnknownTags from './src/getUnknownTags.ts';
import type { VAIC_Config } from './types/config.interface.ts';

export default async function (config: VAIC_Config) {
  return getUnknownTags(config);
}

export * from './src/tools/vuetifyComponentsImporter.ts';
export * from './src/tools/vueUseComponentsImporter.ts';
export * from './src/utils/cli/writeComponents.ts';
export * from './src/utils/cli/writeFinal.ts';
export * from './src/utils/cli/writeResult.ts';
export * from './src/utils/cli/writeStats.ts';
export * from './src/utils/cli/writeToolsResult.ts';
export * from './src/utils/fileUtils.ts';
export * from './src/utils/getComponentList.ts';
export * from './src/utils/getCustomTagList.ts';
export * from './src/utils/tagUtils.ts';
export * from './src/utils/toolsUtils.ts';
