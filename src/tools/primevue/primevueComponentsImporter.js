import { existsSync } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { writeCustomPluginFile } from "../../utils/index.js";
export async function primevueComponentsImporter(basePath, cachePath) {
    try {
        const primevueDirectory = join(basePath, 'node_modules/primevue');
        if (!existsSync(primevueDirectory)) {
            return Promise.reject({ errorText: `PrimeVue Directory not found: ${primevueDirectory}` });
        }
        const listOfDirectories = await readdir(primevueDirectory);
        const componentsList = [];
        for (const dir of listOfDirectories) {
            const dirStat = await stat(join(primevueDirectory, dir));
            const isDir = dirStat.isDirectory();
            if (!isDir) {
                continue;
            }
            const listOfFiles = await readdir(join(primevueDirectory, dir));
            for (const fileName of listOfFiles) {
                const component = fileName.match(/\b(?!Base)([a-zA-Z0-9-]+).vue$/);
                if (component === null) {
                    continue;
                }
                logger.debug(`found primevue component: ${component[1]}`);
                componentsList.push(component[1]);
            }
        }
        const customPluginPath = join(basePath, cachePath);
        await writeCustomPluginFile(customPluginPath, 'primevueTags.json', componentsList);
        return componentsList;
    }
    catch (error) {
        return Promise.reject({ errorText: 'Error importing primevue components:' + error });
    }
}
