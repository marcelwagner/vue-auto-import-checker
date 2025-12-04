import { existsSync } from 'node:fs';
import { appendFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

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

    const vuetifyTagsFile = join(pwd, 'node_modules/.cache/vuetifyTags.json');

    const localVuetifyTagsFileExists = existsSync(vuetifyTagsFile);
    const localDirExists = existsSync(join(pwd, 'node_modules/.cache'));

    if (!localDirExists) {
      await mkdir(join(pwd, 'node_modules/.cache'));
    }

    await (localVuetifyTagsFileExists ? writeFile : appendFile)(
      vuetifyTagsFile,
      `${JSON.stringify(componentsList, null, 2)}\n`,
      'utf8'
    );

    return componentsList;
  } catch (error) {
    return Promise.reject({ errorText: 'Error importing Vuetify components:' + error });
  }
}
