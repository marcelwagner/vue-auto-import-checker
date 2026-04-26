import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { userConfig } from "./config/index.js";
import { getFileContent, logger, statistics } from "./utils/index.js";
export async function getComponentList(config) {
    try {
        userConfig.set(config);
        const { basePath, componentsFile } = userConfig;
        statistics.start();
        const componentsFilePath = join(basePath, componentsFile);
        if (!existsSync(componentsFilePath)) {
            return Promise.reject({
                errorText: `Components file not found: ${componentsFilePath}`
            });
        }
        const componentsFileContent = await getFileContent(componentsFilePath);
        const componentsListRaw = componentsFileContent.match(/\W*export interface GlobalComponents *{\W*[\w\W][^}]+\W*}/m);
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
        statistics.end();
        return componentsList;
    }
    catch (error) {
        return Promise.reject({
            errorText: `Error in getComponentsList: ${error}`
        });
    }
}
