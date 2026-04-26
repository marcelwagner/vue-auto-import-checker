import { existsSync, type Stats } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { getFileContent, logger, writeCustomPluginFile } from '../../utils/index.ts';

/**
 * Imports all vuetify components from the vuetify library
 * @param basePath - base path for resolving node_modules and cache paths
 * @param cachePath - path to the cache directory where the list of components will be stored
 * @returns Promise<string[]> Promise that resolves with the list of component names
 */
export async function vuetifyComponentsImporter(
  basePath: string,
  cachePath: string
): Promise<string[]> {
  try {
    const vuetifyComponentsDirectory: string = join(
      basePath,
      'node_modules/vuetify/lib/components'
    );

    if (!existsSync(vuetifyComponentsDirectory)) {
      return Promise.reject({
        errorText: `Vuetify components directory not found: ${vuetifyComponentsDirectory}`
      });
    }

    const listOfComponents: string[] = await readdir(
      vuetifyComponentsDirectory
    );

    const componentsList: string[] = [];

    for (const dir of listOfComponents) {
      const componentDir: RegExpMatchArray | null =
        dir.match(/^V[A-Z][a-zA-Z0-9]+/);
      const transitionDir: RegExpMatchArray | null = dir.match(/^transitions/);

      if (componentDir === null && transitionDir === null) {
        continue;
      }

      const indexFile: string = join(
        vuetifyComponentsDirectory,
        dir,
        `index.d.ts`
      );

      logger.debug(`vuetify component dir: ${dir}`);

      if (componentDir !== null) {
        const componentContent: string = await getFileContent(indexFile);

        const componentMatchList: RegExpExecArray[] = [
          ...componentContent.matchAll(/export \{ (\w+) } [ ./a-zA-Z';]*/gm)
        ];

        if (componentMatchList.length <= 0) {
          continue;
        }

        componentMatchList.forEach((componentMatch: RegExpExecArray): void => {
          logger.debug(
            `found vuetify component: ${JSON.stringify(componentMatch[1])}`
          );

          componentsList.push(componentMatch[1]);
        });
      } else {
        const transitionsContent: string = await getFileContent(indexFile);
        const componentMatchList: RegExpExecArray[] = [
          ...transitionsContent.matchAll(/export declare const ([a-zA-Z]*)/gm)
        ];

        if (componentMatchList.length <= 0) {
          continue;
        }

        componentMatchList.forEach((componentMatch: RegExpExecArray): void => {
          logger.debug(
            `found vuetify component: ${JSON.stringify(componentMatch[1])}`
          );

          componentsList.push(componentMatch[1]);
        });
      }
    }

    const vuetifyDirectivesDirectory: string = join(
      basePath,
      'node_modules/vuetify/lib/directives'
    );

    if (!existsSync(vuetifyDirectivesDirectory)) {
      return Promise.reject({
        errorText: `Vuetify components directory not found: ${vuetifyDirectivesDirectory}`
      });
    }

    const listOfDirectives: string[] = await readdir(
      vuetifyDirectivesDirectory
    );

    for (const dir of listOfDirectives) {
      const indexFile: string = join(
        vuetifyDirectivesDirectory,
        dir,
        `index.d.ts`
      );

      const dirStat: Stats = await stat(join(vuetifyDirectivesDirectory, dir));
      const isDir: boolean = dirStat.isDirectory();

      if (!isDir) {
        continue;
      }

      const directiveContent: string = await getFileContent(indexFile);

      const directiveMatchList: RegExpExecArray[] = [
        ...directiveContent.matchAll(/export declare const ([a-zA-Z]*)/gm)
      ];

      if (directiveMatchList.length <= 0) {
        continue;
      }

      directiveMatchList.forEach((directiveMatch: RegExpExecArray): void => {
        logger.debug(
          `found vuetify directive: ${JSON.stringify(directiveMatch[1])}`
        );

        componentsList.push(`V${directiveMatch[1]}`);
      });
    }

    const customPluginPath: string = join(basePath, cachePath);

    await writeCustomPluginFile(
      customPluginPath,
      'vuetifyTags.json',
      componentsList
    );

    return [...new Set(componentsList)];
  } catch (error) {
    return Promise.reject({
      errorText: 'Error importing Vuetify components:' + error
    });
  }
}
