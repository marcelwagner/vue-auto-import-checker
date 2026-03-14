import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getFileContent, writeCustomPluginFile } from '../../utils/index.ts';

/**
 * Imports all vueUse components from the vueUse library
 * @param basePath - base path for resolving node_modules and cache paths
 * @param cachePath - path to the cache directory where the list of components will be stored
 * @returns Promise<string[]> Promise that resolves with the list of component names
 */
export async function vueUseComponentsImporter(
  basePath: string,
  cachePath: string
): Promise<string[]> {
  try {
    // index.d.mts for vuetify 13.5.0
    const indexMFile: string = join(basePath, 'node_modules/@vueuse/components/index.d.mts');
    // index.d.mts for vuetify 14.0.0
    const indexFile: string = join(basePath, 'node_modules/@vueuse/components/dist/index.d.ts');

    const indexMFileExists: boolean = existsSync(indexMFile);
    const indexFileExists: boolean = existsSync(indexFile);

    if (!indexMFileExists && !indexFileExists) {
      return Promise.reject({
        errorText: `No index.d.ts or index.d.mts found: ${indexMFile}, ${indexFile}`
      });
    }

    logger.debug(`File: ${indexMFile} exists ${indexMFileExists}`);
    logger.debug(`File: ${indexFile} exists ${indexFileExists}`);

    const fileContent: string = indexMFileExists
      ? await getFileContent(indexMFile)
      : await getFileContent(indexFile);

    const componentsList: string[] = [];

    for (const fileContentLine of fileContent.split('\n')) {
      const component: RegExpMatchArray | null = fileContentLine.match(
        /declare const ([\w]+): (vue.DefineComponent|vue1.DefineSetupFnComponent|vue0.DefineSetupFnComponent)/
      );

      if (component === null) {
        continue;
      }

      logger.debug(`found vueUse component: ${JSON.stringify(component[1])}`);

      componentsList.push(component[1]);
    }

    const customPluginPath: string = join(basePath, cachePath);

    await writeCustomPluginFile(customPluginPath, 'vueUseTags.json', componentsList);

    return componentsList;
  } catch (error) {
    return Promise.reject({ errorText: 'Error importing VueUse components:' + error });
  }
}
