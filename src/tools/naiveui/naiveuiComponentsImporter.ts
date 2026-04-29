import { existsSync, type Stats } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import {
  getErrorText,
  getFileContent,
  logger,
  writeCustomPluginFile
} from '../../utils/index.ts';

/**
 * Imports all naive-ui components from the naive-ui library
 * @param basePath - base path for resolving node_modules and cache paths
 * @param cachePath - path to the cache directory where the list of components will be stored
 * @returns Promise<string[]> Promise that resolves with the list of component names
 */
export async function naiveuiComponentsImporter(
  basePath: string,
  cachePath: string
): Promise<string[]> {
  try {
    const naiveuiDirectory: string = join(
      basePath,
      'node_modules/naive-ui/lib'
    );

    if (!existsSync(naiveuiDirectory)) {
      return Promise.reject({
        errorText: `Naive-UI Directory not found: ${naiveuiDirectory}`
      });
    }

    const listOfDirs: string[] = await readdir(naiveuiDirectory);

    const componentsList: string[] = [];

    for (const dir of listOfDirs) {
      const dirStat: Stats = await stat(join(naiveuiDirectory, dir));

      if (!dirStat.isDirectory()) {
        continue;
      }

      if (dir.match(/^(?!_)[a-z-]+/) === null) {
        continue;
      }

      const indexFile: string = join(naiveuiDirectory, dir, 'index.d.ts');

      if (!existsSync(indexFile)) {
        continue;
      }

      const fileContent: string = await getFileContent(indexFile);
      const lines: string[] = fileContent.split('\n');

      for (const line of lines) {
        const component: RegExpMatchArray | null = line.match(
          /export {[a-zA-Z0-9\W]*default as (N[a-zA-Z0-9-]+)[\W]{0,1}}/
        );

        if (component === null) {
          continue;
        }

        logger.debug(
          `found naiveui component: ${JSON.stringify(component[1])}`
        );

        componentsList.push(component[1]);
      }
    }

    const customPluginPath: string = join(basePath, cachePath);

    await writeCustomPluginFile(
      customPluginPath,
      'naiveuiTags.json',
      componentsList
    );

    return componentsList;
  } catch (error) {
    return Promise.reject({
      errorText: `Error importing naiveui components: ${getErrorText(error)}`
    });
  }
}
