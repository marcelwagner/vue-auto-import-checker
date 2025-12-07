import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { writeCustomPluginFile } from '../utils';

export async function vuetifyComponentsImporter(pwd: string) {
  try {
    const vuetifyDirectory = join(pwd, 'node_modules/vuetify/lib/components');
    const listOfDirectories = await readdir(vuetifyDirectory);

    const componentsList = [];

    for (const dir of listOfDirectories) {
      const componentDir = dir.match(/^V[A-Z][a-zA-Z0-9]+/);

      if (componentDir) {
        const indexFile = join(vuetifyDirectory, dir, `index.d.ts`);
        const listOfComponents = await readFile(indexFile, 'utf8');

        for (const componentExport of listOfComponents.split('\n')) {
          const component = componentExport.match(/export \{ ([\w]+) \} [ ./a-zA-Z';]*/);

          if (component?.[1]) {
            componentsList.push(component[1]);
          }
        }
      }
    }

    await writeCustomPluginFile(
      join(pwd, 'node_modules/.cache'),
      'vuetifyTags.json',
      componentsList
    );

    return componentsList;
  } catch (error) {
    return Promise.reject({ errorText: 'Error importing Vuetify components:' + error });
  }
}
