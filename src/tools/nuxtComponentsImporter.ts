import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { writeCustomPluginFile } from '../utils';

export async function nuxtComponentsImporter(pwd: string) {
  try {
    const nuxtDirectory = join(pwd, 'node_modules/nuxt/dist/app/components');
    const listOfFiles = await readdir(nuxtDirectory);

    const componentsList = [];

    for (const file of listOfFiles) {
      const vueFile = file.match(/([a-zA-Z0-9-]+).vue$/);

      if (vueFile) {
        logger.debug(`found vueFile: ${vueFile}`);

        componentsList.push(vueFile[1]);
      } else {
        const fileContent = await readFile(join(nuxtDirectory, file), 'utf8');
        const componentNameRaw = fileContent.match(
          /defineComponent\(\{[\W]+name: "([a-zA-Z0-9-]+)",/gm
        );

        if (componentNameRaw) {
          const componentName = componentNameRaw[0]
            .replace(/defineComponent\(\{[\W]+name: "/, '')
            .replace('",', '');
          logger.debug(`found component in js file: ${JSON.stringify(componentName)}`);

          componentsList.push(componentName);
        }
      }
    }

    await writeCustomPluginFile(join(pwd, 'node_modules/.cache'), 'nuxtTags.json', componentsList);

    return componentsList;
  } catch (error) {
    return Promise.reject({ errorText: 'Error importing Nuxt components:' + error });
  }
}
