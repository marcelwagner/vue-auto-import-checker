import { join } from 'node:path';
import { userConfig } from "./config/index.js";
import { getComponentList } from "./getComponentsList.js";
import { getIdentifiedTagsList, getKnownLists, getTagsFromDirectoryPaths, statistics } from "./utils/index.js";
export async function getTags(config) {
    try {
        userConfig.set(config);
        const { basePath, projectPaths, negateKnown, knownFrameworks, knownTags, knownTagsFile, cachePath, componentsFile, importsKnown } = userConfig;
        statistics.start();
        const rawTagsList = await getTagsFromDirectoryPaths(basePath, projectPaths);
        const knownTagsList = await getKnownLists({
            negateKnown,
            knownFrameworks,
            knownTags,
            knownTagsFile: knownTagsFile ? join(basePath, knownTagsFile) : '',
            cachePath: join(basePath, cachePath)
        });
        const componentsList = componentsFile
            ? await getComponentList(userConfig)
            : [];
        const identifiedTags = await getIdentifiedTagsList({
            knownTagsList,
            componentsList,
            componentsFile,
            tags: rawTagsList,
            importsKnown
        });
        statistics.end();
        return identifiedTags;
    }
    catch (error) {
        return Promise.reject({ errorText: `Error in getTags: ${error}` });
    }
}
