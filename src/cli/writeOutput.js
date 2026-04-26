import { userConfig } from "../config/index.js";
import { currentDateTime, writeFinalState, writeToolsResult, getJsonResultFromToolTags, writeResult, writeConfig, writeStats, getJsonResultFromTags, writeComponents, getJsonResultFromComponents } from "./index.js";
import { getUniqueFromList } from "../utils/index.js";
export function writeToolOutput(toolTags, toolName) {
    if (userConfig.outputFormat !== 'json') {
        writeToolsResult(toolName, toolTags);
    }
    const foundText = toolTags.length >= 1
        ? `Found ${toolTags.length} ${toolName} tag${toolTags.length >= 2 ? 's' : ''}`
        : `No ${toolName} tags found`;
    const json = userConfig.outputFormat === 'json'
        ? getJsonResultFromToolTags(toolTags)
        : {};
    writeFinalState(false, `${currentDateTime()}: ${foundText}`, 0, json);
}
export function writeTagsOutput(tagsList) {
    const uniqueTagsList = getUniqueFromList(tagsList.map((tag) => tag.tagName));
    const filesList = getUniqueFromList(tagsList.map((tag) => tag.file));
    if (userConfig.outputFormat !== 'json') {
        if (userConfig.showResult) {
            writeResult(tagsList);
        }
        if (userConfig.debug) {
            writeConfig();
        }
        if (userConfig.showStats) {
            writeStats(tagsList);
        }
    }
    const foundText = tagsList.length >= 1
        ? `Found ${uniqueTagsList.length} unique ${userConfig.kafka ? '' : 'unknown '}tag${uniqueTagsList.length >= 2 ? 's' : ''} in ${tagsList.length} line${tagsList.length >= 2 ? 's' : ''} in ${filesList.length} file${filesList.length >= 2 ? 's' : ''}`
        : `No unknown tags found`;
    const json = userConfig.outputFormat === 'json' ? getJsonResultFromTags(tagsList) : {};
    writeFinalState(userConfig.kafka ? false : tagsList.length >= 1, `${currentDateTime()}: ${foundText}`, userConfig.kafka ? 0 : tagsList.length, json);
}
export function writeComponentsOutput(componentsList) {
    if (userConfig.outputFormat !== 'json') {
        writeComponents(componentsList);
    }
    const foundText = componentsList.length >= 1
        ? `Found ${componentsList.length} component${componentsList.length >= 2 ? 's' : ''}`
        : `No components found`;
    const json = userConfig.outputFormat === 'json'
        ? getJsonResultFromComponents(componentsList)
        : {};
    writeFinalState(false, `${currentDateTime()}: ${foundText}`, 0, json);
}
