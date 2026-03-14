import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getFileContent, writeCustomPluginFile } from "../../utils/index.js";
export async function vueUseComponentsImporter(basePath, cachePath) {
    try {
        const indexMFile = join(basePath, 'node_modules/@vueuse/components/index.d.mts');
        const indexFile = join(basePath, 'node_modules/@vueuse/components/dist/index.d.ts');
        const indexMFileExists = existsSync(indexMFile);
        const indexFileExists = existsSync(indexFile);
        if (!indexMFileExists && !indexFileExists) {
            return Promise.reject({
                errorText: `No index.d.ts or index.d.mts found: ${indexMFile}, ${indexFile}`
            });
        }
        logger.debug(`File: ${indexMFile} exists ${indexMFileExists}`);
        logger.debug(`File: ${indexFile} exists ${indexFileExists}`);
        const fileContent = indexMFileExists
            ? await getFileContent(indexMFile)
            : await getFileContent(indexFile);
        const componentsList = [];
        for (const fileContentLine of fileContent.split('\n')) {
            const component = fileContentLine.match(/declare const ([\w]+): (vue.DefineComponent|vue1.DefineSetupFnComponent|vue0.DefineSetupFnComponent)/);
            if (component === null) {
                continue;
            }
            logger.debug(`found vueUse component: ${JSON.stringify(component[1])}`);
            componentsList.push(component[1]);
        }
        const customPluginPath = join(basePath, cachePath);
        await writeCustomPluginFile(customPluginPath, 'vueUseTags.json', componentsList);
        return componentsList;
    }
    catch (error) {
        return Promise.reject({ errorText: 'Error importing VueUse components:' + error });
    }
}
