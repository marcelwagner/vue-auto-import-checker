import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
export async function getFileContent(filePath) {
    try {
        return readFile(filePath, 'utf8');
    }
    catch (error) {
        return Promise.reject({
            errorText: `Error getting file content from file ${filePath} ` + JSON.stringify(error)
        });
    }
}
export async function getJsonFileContent(filePath) {
    try {
        const jsonFileContent = await getFileContent(filePath);
        return JSON.parse(jsonFileContent);
    }
    catch (error) {
        return Promise.reject({
            errorText: `Error getting json file content from files ${filePath} ` + JSON.stringify(error)
        });
    }
}
export async function writeCustomPluginFile(dir, tagsFile, componentsList) {
    if (componentsList.length >= 1) {
        const localDirExists = existsSync(dir);
        if (!localDirExists) {
            logger.debug(`localDir ${dir} will be made`);
            await mkdir(dir);
        }
        const localTagsFile = join(dir, tagsFile);
        logger.debug('localTagsFile', localTagsFile);
        await writeFile(localTagsFile, `${JSON.stringify(componentsList, null, 2)}\n`, {
            flag: 'w+',
            encoding: 'utf-8'
        });
    }
}
