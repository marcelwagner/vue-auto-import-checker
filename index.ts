import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getUnknownTags } from './src/getUnknownTags.ts';
import type { VAIC_Config } from './types/config.interface.ts';

/**
 * Scan a project directory for unknown component tags used inside template blocks.
 *
 * @param config - configuration object adhering to `VAIC_Config`
 * @returns Promise<VAIC_ComponentSearch> - Promise resolving to ComponentSearch containing stats, unknownTags and componentsList
 */
export default async function (config: VAIC_Config): Promise<Tag[]> {
  return getUnknownTags({
    ...config,
    basePath: config.basePath ?? dirname(fileURLToPath(import.meta.url))
  } as InternalConfig);
}

export * from './src/cli/index.ts';
export * from './src/config/index.ts';
export * from './src/getComponentsList.ts';
export * from './src/getTags.ts';
export * from './src/getToolTags.ts';
export * from './src/getUnknownTags.js';
export * from './src/tools/index.ts';
export * from './src/utils/index.ts';

export { getUnknownTags };
export type { VAIC_Config };
