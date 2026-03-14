import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { writeCustomPluginFile } from '../../utils/index.ts';

/**
 * Imports all vuetify components from the vuetify library
 * @param basePath - base path for resolving node_modules and cache paths
 * @param cachePath - path to the cache directory where the list of components will be stored
 * @returns Promise<string[]> Promise that resolves with the list of component names
 */
export async function vuetifyComponentsImporter(
  basePath: string,
  cachePath: string
): Promise<string[]> {
  try {
    const vuetifyDirectory: string = join(basePath, 'node_modules/vuetify/lib/components');

    if (!existsSync(vuetifyDirectory)) {
      return Promise.reject({ errorText: `Vuetify Directory not found: ${vuetifyDirectory}` });
    }

    const listOfDirectories: string[] = await readdir(vuetifyDirectory);

    const componentsList: string[] = [];

    for (const dir of listOfDirectories) {
      const componentDir: RegExpMatchArray | null = dir.match(/^V[A-Z][a-zA-Z0-9]+/);

      if (componentDir === null) {
        continue;
      }

      const indexFile: string = join(vuetifyDirectory, dir, `index.d.ts`);
      const listOfComponents: string = await readFile(indexFile, 'utf8');

      for (const componentExport of listOfComponents.split('\n')) {
        const component: RegExpMatchArray | null = componentExport.match(
          /export \{ (\w+) } [ ./a-zA-Z';]*/
        );

        if (component === null) {
          continue;
        }

        logger.debug(`found vuetify component: ${JSON.stringify(component[1])}`);

        componentsList.push(component[1]);
      }
    }

    const customPluginPath: string = join(basePath, cachePath);

    await writeCustomPluginFile(customPluginPath, 'vuetifyTags.json', componentsList);

    return componentsList;
  } catch (error) {
    return Promise.reject({ errorText: 'Error importing Vuetify components:' + error });
  }
}
