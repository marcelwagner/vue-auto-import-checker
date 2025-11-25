import fs from 'node:fs';
import fsPromise from 'node:fs/promises';
import path from 'node:path';

export async function vuetifyComponentsImporter(basePath: string) {
  try {
    const vuetifyDirectory = path.join(basePath, './node_modules/vuetify/lib/components');
    const listOfDirectories = await fsPromise.readdir(vuetifyDirectory);

    const componentsList = [];

    for (const dir of listOfDirectories) {
      const componentDir = dir.match(/^V[A-Z][a-zA-Z0-9]+/);

      if (componentDir) {
        const indexFile = path.join(vuetifyDirectory, dir, `/index.d.ts`);
        const listOfComponents = await fsPromise.readFile(indexFile, 'utf8');

        for (const componentExport of listOfComponents.split('\n')) {
          const component = componentExport.match(/export \{ ([\w]+) \} [ ./a-zA-Z';]*/);

          if (component?.[1]) {
            componentsList.push(component[1]);
          }
        }
      }
    }

    const vuetifyTagsFile = path.join(basePath, './.plugincache/vuetifyTags.json');

    const localVuetifyTagsFileExists = fs.existsSync(vuetifyTagsFile);
    const localDirExists = fs.existsSync(path.join(basePath, './.plugincache'));

    if (!localDirExists) {
      await fsPromise.mkdir(path.join(basePath, './.plugincache'));
    }

    await fsPromise[localVuetifyTagsFileExists ? 'writeFile' : 'appendFile'](
      vuetifyTagsFile,
      `${JSON.stringify(componentsList, null, 2)}\n`,
      'utf8'
    );

    return componentsList;
  } catch (error) {
    return Promise.reject({ errorText: 'Error importing Vuetify components:' + error });
  }
}
