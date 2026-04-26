import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getFileContent, logger, writeCustomPluginFile } from '../../utils/index.ts';

/**
 * Imports all quasar components from the quasar library
 * @param basePath - base path for resolving node_modules and cache paths
 * @param cachePath - path to the cache directory where the list of components will be stored
 * @returns Promise<string[]> Promise that resolves with the list of component names
 */
export async function quasarComponentsImporter(
  basePath: string,
  cachePath: string
): Promise<string[]> {
  try {
    const componentsFile: string = join(
      basePath,
      'node_modules/quasar/src/components.js'
    );

    if (!existsSync(componentsFile)) {
      return Promise.reject({
        errorText: `No components.js found: ${componentsFile}`
      });
    }

    const listOfComponents: string = await getFileContent(componentsFile);

    const componentsList: string[] = [];

    for (const componentExport of listOfComponents.split('\n')) {
      const component: RegExpMatchArray | null = componentExport.match(
        /export \* from \W.\/components\/([\w-]+)\/index.js\W/
      );

      if (component === null) {
        continue;
      }

      logger.debug(
        `found quasar component: ${JSON.stringify(`q-${component[1]}`)}`
      );

      componentsList.push(`q-${component[1]}`);
    }

    const customPluginPath: string = join(basePath, cachePath);

    await writeCustomPluginFile(
      customPluginPath,
      'quasarTags.json',
      componentsList
    );

    return componentsList;
  } catch (error) {
    return Promise.reject({
      errorText: 'Error importing Quasar components:' + error
    });
  }
}
