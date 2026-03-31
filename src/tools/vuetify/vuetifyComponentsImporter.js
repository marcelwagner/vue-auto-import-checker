import { existsSync } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { getFileContent, writeCustomPluginFile } from "../../utils/index.js";
export async function vuetifyComponentsImporter(basePath, cachePath) {
    try {
        const vuetifyComponentsDirectory = join(basePath, 'node_modules/vuetify/lib/components');
        if (!existsSync(vuetifyComponentsDirectory)) {
            return Promise.reject({
                errorText: `Vuetify components directory not found: ${vuetifyComponentsDirectory}`
            });
        }
        const listOfComponents = await readdir(vuetifyComponentsDirectory);
        const componentsList = [];
        for (const dir of listOfComponents) {
            const componentDir = dir.match(/^V[A-Z][a-zA-Z0-9]+/);
            const transitionDir = dir.match(/^transitions/);
            if (componentDir === null && transitionDir === null) {
                continue;
            }
            const indexFile = join(vuetifyComponentsDirectory, dir, `index.d.ts`);
            logger.debug(`vuetify component dir: ${dir}`);
            if (componentDir !== null) {
                const componentContent = await getFileContent(indexFile);
                const componentMatchList = [
                    ...componentContent.matchAll(/export \{ (\w+) } [ ./a-zA-Z';]*/gm)
                ];
                if (componentMatchList.length <= 0) {
                    continue;
                }
                componentMatchList.forEach((componentMatch) => {
                    logger.debug(`found vuetify component: ${JSON.stringify(componentMatch[1])}`);
                    componentsList.push(componentMatch[1]);
                });
            }
            else {
                const transitionsContent = await getFileContent(indexFile);
                const componentMatchList = [
                    ...transitionsContent.matchAll(/export declare const ([a-zA-Z]*)/gm)
                ];
                if (componentMatchList.length <= 0) {
                    continue;
                }
                componentMatchList.forEach((componentMatch) => {
                    logger.debug(`found vuetify component: ${JSON.stringify(componentMatch[1])}`);
                    componentsList.push(componentMatch[1]);
                });
            }
        }
        const vuetifyDirectivesDirectory = join(basePath, 'node_modules/vuetify/lib/directives');
        if (!existsSync(vuetifyDirectivesDirectory)) {
            return Promise.reject({
                errorText: `Vuetify components directory not found: ${vuetifyDirectivesDirectory}`
            });
        }
        const listOfDirectives = await readdir(vuetifyDirectivesDirectory);
        for (const dir of listOfDirectives) {
            const indexFile = join(vuetifyDirectivesDirectory, dir, `index.d.ts`);
            const dirStat = await stat(join(vuetifyDirectivesDirectory, dir));
            const isDir = dirStat.isDirectory();
            if (!isDir) {
                continue;
            }
            const directiveContent = await getFileContent(indexFile);
            const directiveMatchList = [
                ...directiveContent.matchAll(/export declare const ([a-zA-Z]*)/gm)
            ];
            if (directiveMatchList.length <= 0) {
                continue;
            }
            directiveMatchList.forEach((directiveMatch) => {
                logger.debug(`found vuetify directive: ${JSON.stringify(directiveMatch[1])}`);
                componentsList.push(`V${directiveMatch[1]}`);
            });
        }
        const customPluginPath = join(basePath, cachePath);
        await writeCustomPluginFile(customPluginPath, 'vuetifyTags.json', componentsList);
        return [...new Set(componentsList)];
    }
    catch (error) {
        return Promise.reject({ errorText: 'Error importing Vuetify components:' + error });
    }
}
