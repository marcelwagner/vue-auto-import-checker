import { existsSync } from 'node:fs';
import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function vueUseComponentsImporter(pwd: string) {
  try {
    // index.d.mts for vuetify 13.5.0
    const indexMFile = join(pwd, 'node_modules/@vueuse/components/index.d.mts');
    // index.d.mts for vuetify 14.0.0
    const indexFile = join(pwd, 'node_modules/@vueuse/components/dist/index.d.ts');

    const indexMFileExists = existsSync(indexMFile);
    const indexFileExists = existsSync(indexFile);

    if (!indexMFileExists && !indexFileExists) {
      return Promise.reject({ errorText: 'No index.d.ts or index.d.mts found' });
    }

    const listOfComponents = indexMFileExists
      ? await readFile(indexMFile, 'utf8')
      : await readFile(indexFile, 'utf8');

    const componentsList = [];

    for (const componentExport of listOfComponents.split('\n')) {
      const component = componentExport.match(
        /declare const ([\w]+): vue.DefineComponent|vue1.DefineSetupFnComponent/
      );

      if (component?.[1]) {
        componentsList.push(component[1]);
      }
    }

    const vueUseTagsFile = join(pwd, 'node_modules/.cache/vueUseTags.json');

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
    return Promise.reject({ errorText: 'Error importing Vuetify components:' + error });
  }
}
