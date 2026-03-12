import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { writeCustomPluginFile } from '../../utils/index.ts';

export async function quasarComponentsImporter(basePath: string, cachePath: string) {
  try {
    const componentsFile = join(basePath, 'node_modules/quasar/src/components.js');

    if (!existsSync(componentsFile)) {
      return Promise.reject({ errorText: `No components.js found: ${componentsFile}` });
    }

    const listOfComponents = await readFile(componentsFile, 'utf8');

    const componentsList = [];

    for (const componentExport of listOfComponents.split('\n')) {
      const component = componentExport.match(
        /export \* from \W.\/components\/([\w-]+)\/index.js\W/
      );

      if (component === null) {
        continue;
      }

      logger.debug(`found quasar component: ${JSON.stringify(`q-${component[1]}`)}`);

      componentsList.push(`q-${component[1]}`);
    }

    const customPluginPath = join(basePath, cachePath);

    await writeCustomPluginFile(customPluginPath, 'quasarTags.json', componentsList);

    return componentsList;
  } catch (error) {
    return Promise.reject({ errorText: 'Error importing Quasar components:' + error });
  }
}
