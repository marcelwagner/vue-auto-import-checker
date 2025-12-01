import fs from 'node:fs';
import fsPromise from 'node:fs/promises';
import path from 'node:path';

export async function quasarComponentsImporter(pwd: string) {
  try {
    // index.d.mts for quasar 1.15.8
    const componentsFile = path.join(pwd, 'node_modules/quasar/src/components.js');

    const componentsFileExists = fs.existsSync(componentsFile);

    if (!componentsFileExists) {
      return Promise.reject({ errorText: 'No components.js found' });
    }

    const listOfComponents = await fsPromise.readFile(componentsFile, 'utf8');

    const componentsList = [];

    for (const componentExport of listOfComponents.split('\n')) {
      const component = componentExport.match(
        /export \* from \W.\/components\/([\w-]+)\/index.js\W/
      );

      if (component?.[1]) {
        componentsList.push(`q-${component[1]}`);
      }
    }

    const vueUseTagsFile = path.join(pwd, 'node_modules/.cache/quasarTags.json');

    const localVueUseTagsFileExists = fs.existsSync(vueUseTagsFile);
    const localDirExists = fs.existsSync(path.join(pwd, 'node_modules/.cache'));

    if (!localDirExists) {
      await fsPromise.mkdir(path.join(pwd, 'node_modules/.cache'));
    }

    await fsPromise[localVueUseTagsFileExists ? 'writeFile' : 'appendFile'](
      vueUseTagsFile,
      `${JSON.stringify(componentsList, null, 2)}\n`,
      'utf8'
    );

    return componentsList;
  } catch (error) {
    return Promise.reject({ errorText: 'Error importing Quasar components:' + error });
  }
}
