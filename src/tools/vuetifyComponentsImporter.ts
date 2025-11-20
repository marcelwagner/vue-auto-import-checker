import fs from 'node:fs/promises';

export async function vuetifyComponentsImporter () {
  try {
    const vuetifyDirectory = './node_modules/vuetify/lib/components';
    const listOfDirectories = await fs.readdir(vuetifyDirectory);

    const componentsList = [];

    for (const dir of listOfDirectories) {
      const componentDir = dir.match(/^V[A-Z][a-zA-Z0-9]+/);

      if (componentDir) {
        const indexFile = `${vuetifyDirectory}/${dir}/index.d.ts`;
        const listOfComponents = await fs.readFile(indexFile, 'utf8');

        for (const componentExport of listOfComponents.split('\n')) {
          const component = componentExport.match(/export \{ ([\w]+) \} [ \.\/a-zA-Z';]*/);

          if (component?.[1]) {
            componentsList.push(component[1]);
          }
        }
      }
    }

    const vuetifyTagsFile = './src/plugins/vuetifyTags.ts';

    await fs.writeFile(
      vuetifyTagsFile,
      `export const vuetifyTags = ${JSON.stringify(componentsList, null, 2)} as string[];\n`,
      'utf8'
    );

    return componentsList;
  } catch (error) {
    return Promise.reject({ errorText: 'Error importing Vuetify components:' + error});
  }
}
