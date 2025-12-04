import { existsSync } from 'node:fs';
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function quasarComponentsImporter(pwd: string) {
  try {
    // index.d.mts for quasar 1.15.8
    const componentsFile = join(pwd, 'node_modules/quasar/src/components.js');

    const componentsFileExists = existsSync(componentsFile);

    if (!componentsFileExists) {
      return Promise.reject({ errorText: 'No components.js found' });
    }

    const listOfComponents = await readFile(componentsFile, 'utf8');

    const componentsList = [];

    for (const componentExport of listOfComponents.split('\n')) {
      const component = componentExport.match(
        /export \* from \W.\/components\/([\w-]+)\/index.js\W/
      );

      if (component?.[1]) {
        componentsList.push(`q-${component[1]}`);
      }
    }

    const vueUseTagsFile = join(pwd, 'node_modules/.cache/quasarTags.json');

    const localVueUseTagsFileExists = existsSync(vueUseTagsFile);
    const localDirExists = existsSync(join(pwd, 'node_modules/.cache'));

    if (!localDirExists) {
      await mkdir(join(pwd, 'node_modules/.cache'));
    }

    await (localVueUseTagsFileExists ? writeFile : appendFile)(
      vueUseTagsFile,
      `${JSON.stringify(componentsList, null, 2)}\n`,
      'utf8'
    );

    return componentsList;
  } catch (error) {
    return Promise.reject({ errorText: 'Error importing Quasar components:' + error });
  }
}
