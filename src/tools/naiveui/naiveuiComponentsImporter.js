import { existsSync } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { getFileContent, logger, writeCustomPluginFile } from "../../utils/index.js";
export async function naiveuiComponentsImporter(basePath, cachePath) {
    try {
        const naiveuiDirectory = join(basePath, 'node_modules/naive-ui/lib');
        if (!existsSync(naiveuiDirectory)) {
            return Promise.reject({
                errorText: `Naive-UI Directory not found: ${naiveuiDirectory}`
            });
        }
        const listOfDirs = await readdir(naiveuiDirectory);
        const componentsList = [];
        for (const dir of listOfDirs) {
            const dirStat = await stat(join(naiveuiDirectory, dir));
            if (!dirStat.isDirectory()) {
                continue;
            }
            if (dir.match(/^(?!_)[a-z-]+/) === null) {
                continue;
            }
            const indexFile = join(naiveuiDirectory, dir, 'index.d.ts');
            if (!existsSync(indexFile)) {
                continue;
            }
            const fileContent = await getFileContent(indexFile);
            const lines = fileContent.split('\n');
            for (const line of lines) {
                const component = line.match(/export {[a-zA-Z0-9\W]*default as (N[a-zA-Z0-9-]+)[\W]{0,1}}/);
                if (component === null) {
                    continue;
                }
                logger.debug(`found naiveui component: ${JSON.stringify(component[1])}`);
                componentsList.push(component[1]);
            }
        }
        const customPluginPath = join(basePath, cachePath);
        await writeCustomPluginFile(customPluginPath, 'naiveuiTags.json', componentsList);
        return componentsList;
    }
    catch (error) {
        return Promise.reject({
            errorText: 'Error importing naiveui components:' + error
        });
    }
}
