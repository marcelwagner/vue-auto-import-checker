import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import {
  getFileContent,
  logger,
  writeCustomPluginFile
} from '../../utils/index.ts';

/**
 * Imports all nuxt components from the nuxt library
 * @param basePath - base path for resolving node_modules and cache paths
 * @param cachePath - path to the cache directory where the list of components will be stored
 * @returns Promise<string[]> Promise that resolves with the list of component names
 */
export async function nuxtComponentsImporter(
  basePath: string,
  cachePath: string
): Promise<string[]> {
  try {
    const nuxtDirectory: string = join(
      basePath,
      'node_modules/nuxt/dist/app/components'
    );

    if (!existsSync(nuxtDirectory)) {
      return Promise.reject({
        errorText: `Nuxt Directory not found: ${nuxtDirectory}`
      });
    }

    const listOfFiles: string[] = await readdir(nuxtDirectory);

    const componentsList: string[] = [];

    for (const file of listOfFiles) {
      const vueFile: RegExpMatchArray | null =
        file.match(/([a-zA-Z0-9-]+).vue$/);

      if (vueFile) {
        logger.debug(`found vueFile: ${vueFile}`);
        componentsList.push(vueFile[1]);
        continue;
      }

      const fileContent: string = await getFileContent(
        join(nuxtDirectory, file)
      );
      const componentNameRaw: RegExpMatchArray | null = fileContent.match(
        /defineComponent\(\{[\W]+name: "([a-zA-Z0-9-]+)",/gm
      );

      if (!componentNameRaw) {
        continue;
      }

      const componentName: string = componentNameRaw[0]
        .replace(/defineComponent\(\{[\W]+name: "/, '')
        .replace('",', '');

      logger.debug(`found nuxt component: ${JSON.stringify(componentName)}`);

      componentsList.push(componentName);
    }

    const customPluginPath: string = join(basePath, cachePath);

    await writeCustomPluginFile(
      customPluginPath,
      'nuxtTags.json',
      componentsList
    );

    return componentsList;
  } catch (error) {
    return Promise.reject({
      errorText: 'Error importing Nuxt components:' + error
    });
  }
}
