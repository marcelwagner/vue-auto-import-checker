import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { writeCustomPluginFile } from "../../utils/index.js";
export async function nuxtComponentsImporter(basePath, cachePath) {
    try {
        const nuxtDirectory = join(basePath, 'node_modules/nuxt/dist/app/components');
        if (!existsSync(nuxtDirectory)) {
            return Promise.reject({ errorText: `Nuxt Directory not found: ${nuxtDirectory}` });
        }
        const listOfFiles = await readdir(nuxtDirectory);
        const componentsList = [];
        for (const file of listOfFiles) {
            const vueFile = file.match(/([a-zA-Z0-9-]+).vue$/);
            if (vueFile) {
                logger.debug(`found vueFile: ${vueFile}`);
                componentsList.push(vueFile[1]);
                continue;
            }
            const fileContent = await readFile(join(nuxtDirectory, file), 'utf8');
            const componentNameRaw = fileContent.match(/defineComponent\(\{[\W]+name: "([a-zA-Z0-9-]+)",/gm);
            if (!componentNameRaw) {
                continue;
            }
            const componentName = componentNameRaw[0]
                .replace(/defineComponent\(\{[\W]+name: "/, '')
                .replace('",', '');
            logger.debug(`found nuxt component: ${JSON.stringify(componentName)}`);
            componentsList.push(componentName);
        }
        const customPluginPath = join(basePath, cachePath);
        await writeCustomPluginFile(customPluginPath, 'nuxtTags.json', componentsList);
        return componentsList;
    }
    catch (error) {
        return Promise.reject({ errorText: 'Error importing Nuxt components:' + error });
    }
}
