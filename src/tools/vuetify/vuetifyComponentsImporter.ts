import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { writeCustomPluginFile } from '../../utils/index.ts';

/**
 * Imports all vuetify components from the vuetify library
 * @param basePath
 * @param cachePath
 */
export async function vuetifyComponentsImporter(basePath: string, cachePath: string) {
  try {
    const vuetifyDirectory = join(basePath, 'node_modules/vuetify/lib/components');

    if (!existsSync(vuetifyDirectory)) {
      return Promise.reject({ errorText: `Vuetify Directory not found: ${vuetifyDirectory}` });
    }

    const listOfDirectories = await readdir(vuetifyDirectory);

    const componentsList = [];

    for (const dir of listOfDirectories) {
      const componentDir = dir.match(/^V[A-Z][a-zA-Z0-9]+/);

      if (componentDir === null) {
        continue;
      }

      const indexFile = join(vuetifyDirectory, dir, `index.d.ts`);
      const listOfComponents = await readFile(indexFile, 'utf8');

      for (const componentExport of listOfComponents.split('\n')) {
        const component = componentExport.match(/export \{ (\w+) } [ ./a-zA-Z';]*/);

        if (component === null) {
          continue;
        }

        logger.debug(`found vuetify component: ${JSON.stringify(component[1])}`);

        componentsList.push(component[1]);
      }
    }

    const customPluginPath = join(basePath, cachePath);

    await writeCustomPluginFile(customPluginPath, 'vuetifyTags.json', componentsList);

    return componentsList;
  } catch (error) {
    return Promise.reject({ errorText: 'Error importing Vuetify components:' + error });
  }
}
