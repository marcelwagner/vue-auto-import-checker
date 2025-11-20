import fs from 'node:fs/promises';

export async function vueUseComponentsImporter () {
  try {
    const indexFile = './node_modules/@vueuse/components/dist/index.d.ts';
    const listOfComponents = await fs.readFile(indexFile, 'utf8');

    const componentsList = [];

    for (const componentExport of listOfComponents.split('\n')) {
      const component = componentExport.match(/declare const ([\w]+): vue1.DefineSetupFnComponent/);

      if (component?.[1]) {
        componentsList.push(component[1]);
      }
    }

    const vueUseTagsFile = './src/plugins/vueUseTags.ts';

    await fs.writeFile(
      vueUseTagsFile,
      `export const vueUseTags: string[] = ${JSON.stringify(componentsList, null, 2)};\n`,
      'utf8'
    );

    return componentsList;
  } catch (error) {
    return Promise.reject({ errorText: 'Error importing Vuetify components:' + error});
  }
}
