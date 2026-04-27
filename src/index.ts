import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getUnknownTags } from './getUnknownTags.ts';

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

export * from './getComponentsList.ts';
export * from './getTags.ts';
export * from './getToolTags.ts';
export * from './getUnknownTags.js';

export { getUnknownTags };
