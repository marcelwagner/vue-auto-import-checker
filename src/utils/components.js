import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
export async function getKnownComponentList(basePath, componentsFile) {
    const componentsFilePath = join(basePath, componentsFile);
    if (!existsSync(componentsFilePath)) {
        return Promise.reject({ errorText: `Components file not found: ${componentsFilePath}` });
    }
    try {
        const componentsFileContent = await readFile(componentsFilePath, 'utf8');
        const componentsListRaw = componentsFileContent.match(/[\W]*export interface GlobalComponents \{\W[\w\W][^}]+\W  \}/m);
        const componentsList = [];
        if (componentsListRaw?.[0]) {
            componentsListRaw[0]
                .replace(/[\W]*export interface GlobalComponents \{\W/, '')
                .replace(/[\W]*\}/, '')
                .split(/\n/)
                .forEach((line) => {
                const rawMatch = line
                    .trim()
                    .replace(/: typeof import\('[a-zA-Z0-9-./'[\]()",]+/, '');
                componentsList.push(rawMatch);
            });
        }
        logger.debug(`Componentlist from file ${componentsFilePath}:`);
        logger.debug(JSON.stringify(componentsList, null, 2));
        return componentsList;
    }
    catch (error) {
        return Promise.reject({ errorText: `Error in getComponentList: ${error}` });
    }
}
