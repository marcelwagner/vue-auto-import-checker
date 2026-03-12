import { getUnknownTags } from './src/getUnknownTags.ts';
import type { VAIC_ComponentSearch, VAIC_Config } from './types/config.interface.ts';

/**
 * Scan a project directory for unknown component tags used inside template blocks.
 *
 * @param {VAIC_Config} config - configuration object adhering to `VAIC_Config`
 * @returns {Promise<VAIC_ComponentSearch>} Promise resolving to ComponentSearch containing stats, unknownTags and componentsList
 */
export default async function (config: VAIC_Config): Promise<VAIC_ComponentSearch> {
  return getUnknownTags(config);
}

export * from './src/cli/index.ts';
export * from './src/tools/index.ts';
export * from './src/utils/index.ts';
export type { VAIC_ComponentSearch, VAIC_Config } from './types/config.interface.ts';
