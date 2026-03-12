import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLogger, getIdentifiedTagsList, getKnownComponentList, getKnownLists, getTagsFromDirectory, getUnknownTagsList } from "./utils/index.js";
export async function getUnknownTags({ componentsFile, projectPath, negateKnown, knownFrameworks, knownTags, knownTagsFile, cachePath, basePath, importsKnown, debug, skipReturnUnknown }) {
    const base = basePath ? basePath : dirname(fileURLToPath(import.meta.url));
    if (!global?.logger) {
        createLogger(Boolean(debug));
    }
    const startTime = Date.now();
    global.stats = {
        fileCounter: 0,
        dirCounter: 0,
        templateFiles: 0,
        startTime,
        endTime: startTime
    };
    const rawTagsList = await getTagsFromDirectory(base, projectPath, []);
    const knownTagsList = await getKnownLists({
        negateKnown,
        knownFrameworks,
        knownTags,
        knownTagsFile: knownTagsFile ? join(base, knownTagsFile) : '',
        cachePath: join(base, cachePath)
    });
    const componentsList = componentsFile
        ? await getKnownComponentList(base, componentsFile)
        : [];
    const tagsList = await getIdentifiedTagsList({
        knownTagsList,
        componentsList,
        componentsFile,
        tags: rawTagsList,
        importsKnown
    });
    const unknownTagsList = skipReturnUnknown ? [] : await getUnknownTagsList(tagsList);
    stats.endTime = Date.now();
    return {
        stats,
        tagsList,
        unknownTagsList,
        componentsList
    };
}
