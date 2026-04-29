import { existsSync, type Stats } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import {
  getErrorText,
  logger,
  writeCustomPluginFile
} from '../../utils/index.ts';

/**
 * Imports all primevue components from the primevue library
 * @param basePath - base path for resolving node_modules and cache paths
 * @param cachePath - path to the cache directory where the list of components will be stored
 * @returns Promise<string[]> Promise that resolves with the list of component names
 */
export async function primevueComponentsImporter(
  basePath: string,
  cachePath: string
): Promise<string[]> {
  try {
    const primevueDirectory: string = join(basePath, 'node_modules/primevue');

    if (!existsSync(primevueDirectory)) {
      return Promise.reject({
        errorText: `PrimeVue Directory not found: ${primevueDirectory}`
      });
    }

    const listOfDirectories: string[] = await readdir(primevueDirectory);

    const componentsList: string[] = [];

    for (const dir of listOfDirectories) {
      const dirStat: Stats = await stat(join(primevueDirectory, dir));
      const isDir: boolean = dirStat.isDirectory();

      if (!isDir) {
        continue;
      }

      const listOfFiles: string[] = await readdir(join(primevueDirectory, dir));

      for (const fileName of listOfFiles) {
        const component: RegExpMatchArray | null = fileName.match(
          /\b(?!Base)([a-zA-Z0-9-]+).vue$/
        );

        if (component === null) {
          continue;
        }

        logger.debug(`found primevue component: ${component[1]}`);

        componentsList.push(component[1]);
      }
    }

    const customPluginPath: string = join(basePath, cachePath);

    await writeCustomPluginFile(
      customPluginPath,
      'primevueTags.json',
      componentsList
    );

    return componentsList;
  } catch (error) {
    return Promise.reject({
      errorText: `Error importing primevue components: ${getErrorText(error)}`
    });
  }
}
