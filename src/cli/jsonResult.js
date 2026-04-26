import { userConfig } from "../config/index.js";
import { getUniqueFromList, statistics } from "../utils/index.js";
import { getDuration } from "./index.js";
export function getJsonResultFromTags(tagsList) {
    const stats = statistics.getStats();
    const uniqueTagsList = getUniqueFromList(tagsList.map((tag) => tag.tagName));
    const filesList = getUniqueFromList(tagsList.map((tag) => tag.file));
    const result = `${userConfig.kafka ? 't' : 'unknownT'}ags`;
    return {
        [result]: tagsList,
        uniqueTags: uniqueTagsList,
        filesContainingTags: filesList,
        summary: {
            lines: tagsList.length,
            uniqueTags: uniqueTagsList.length,
            filesContainingTags: filesList.length
        },
        stats: {
            directories: stats.dirCounter,
            files: stats.fileCounter,
            templateFiles: stats.templateFiles,
            duration: getDuration()
        },
        total: uniqueTagsList.length,
        success: (!userConfig.kafka && tagsList.length === 0) ||
            (userConfig.kafka && tagsList.length >= 1)
    };
}
export function getJsonResultFromComponents(componentsList) {
    return {
        components: componentsList,
        stats: {
            duration: getDuration()
        },
        total: componentsList.length,
        success: componentsList.length >= 1
    };
}
export function getJsonResultFromToolTags(tagsList) {
    return {
        components: tagsList,
        stats: {
            duration: getDuration()
        },
        total: tagsList.length,
        success: tagsList.length >= 1
    };
}
