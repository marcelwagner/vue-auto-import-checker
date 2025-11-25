import fs from 'node:fs';
import fsPromise from 'node:fs/promises';
import path from 'node:path';

export async function vueUseComponentsImporter(basePath: string) {
  try {
    // index.d.mts for vuetify 13.5.0
    const indexMFile = path.join(basePath, './node_modules/@vueuse/components/index.d.mts');
    // index.d.mts for vuetify 14.0.0
    const indexFile = path.join(basePath, './node_modules/@vueuse/components/dist/index.d.ts');

    const indexMFileExists = fs.existsSync(indexMFile);
    const indexFileExists = fs.existsSync(indexFile);

    if (!indexMFileExists && !indexFileExists) {
      return Promise.reject({ errorText: 'No index.d.ts or index.d.mts found' });
    }

    const listOfComponents = indexMFileExists
      ? await fsPromise.readFile(indexMFile, 'utf8')
      : await fsPromise.readFile(indexFile, 'utf8');

    const componentsList = [];

    for (const componentExport of listOfComponents.split('\n')) {
      const component = componentExport.match(
        /declare const ([\w]+): vue.DefineComponent|vue1.DefineSetupFnComponent/
      );

      if (component?.[1]) {
        componentsList.push(component[1]);
      }
    }

    const vueUseTagsFile = path.join(basePath, './.plugincache/vueUseTags.json');

    const localVueUseTagsFileExists = fs.existsSync(vueUseTagsFile);
    const localDirExists = fs.existsSync(path.join(basePath, './.plugincache'));

    if (!localDirExists) {
      await fsPromise.mkdir(path.join(basePath, './.plugincache'));
    }

    await fsPromise[localVueUseTagsFileExists ? 'writeFile' : 'appendFile'](
      vueUseTagsFile,
      `${JSON.stringify(componentsList, null, 2)}\n`,
      'utf8'
    );

    return componentsList;
  } catch (error) {
    return Promise.reject({ errorText: 'Error importing Vuetify components:' + error });
  }
}
