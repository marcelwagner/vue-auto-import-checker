import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { vueTemplateEnd, vueTemplateStart } from "../config/index.js";
import { getBaseTags, getFileContent, getFrameworkTools, getJsonFileContent, normalize } from "./index.js";
export async function getTagsFromFile(file, tags) {
    stats.fileCounter++;
    const fileContent = await getFileContent(file);
    logger.debug(`File: ${file}`);
    const linesOfFile = fileContent.split(/\n/);
    logger.debug(`All lines length: ${linesOfFile.length}`);
    const templateStartIndex = linesOfFile.findIndex((line) => line.trim().includes(vueTemplateStart));
    const templateEndIndex = linesOfFile.findLastIndex((line) => line.trim().includes(vueTemplateEnd));
    if (templateStartIndex === -1) {
        logger.debug(`Did not find ${vueTemplateStart}`);
        return tags;
    }
    stats.templateFiles++;
    logger.debug(`Index of first ${vueTemplateStart}: ${templateStartIndex}`);
    logger.debug(`Index of last ${vueTemplateEnd}: ${templateEndIndex}`);
    const tagList = getTagsFromTemplate(linesOfFile, templateStartIndex, templateEndIndex);
    const imports = getImportsListFromFile(fileContent);
    tagList.forEach((tagListRaw, index) => {
        tagListRaw.forEach((tagRaw) => {
            const componentMatch = imports.find((imp) => imp.component.some((comp) => normalize(comp) === normalize(tagRaw)));
            tags.push({
                line: index + 1,
                tagName: tagRaw,
                lines: getLinesForReport(linesOfFile, index),
                file,
                known: false,
                knownSource: componentMatch
                    ? [{ source: 'import', known: true, file: componentMatch.path }]
                    : []
            });
        });
    });
    return tags;
}
export async function getTagsFromDirectory(basePath, directoryPath, tags) {
    stats.dirCounter++;
    const directory = join(basePath, directoryPath);
    logger.debug(`Dir: ${directory}`);
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = join(directory, entry.name);
        if (entry.isFile()) {
            try {
                await getTagsFromFile(fullPath, tags);
            }
            catch (error) {
                if (!quiet) {
                    return Promise.reject({
                        errorText: `Error getting Tags from file ${fullPath}: ${JSON.stringify(error)}`
                    });
                }
            }
        }
        else if (entry.isDirectory()) {
            try {
                await getTagsFromDirectory(basePath, join(directoryPath, entry.name), tags);
            }
            catch (error) {
                if (!quiet) {
                    return Promise.reject({
                        errorText: `Error getting Tags from path ${fullPath}: ${JSON.stringify(error)}`
                    });
                }
            }
        }
        else {
        }
    }
    return tags;
}
export async function getUnknownTagsList(tags) {
    return tags.filter((tag) => {
        const tagName = normalize(tag.tagName);
        if (!tag.known) {
            logger.debug(`tag ${tagName} is unknown`);
            return true;
        }
        logger.debug(`tag ${tagName} is known`);
        return false;
    });
}
export async function getIdentifiedTagsList({ knownTagsList, componentsList, componentsFile, tags, importsKnown }) {
    return tags.map((tag) => {
        const tagName = normalize(tag.tagName);
        if (knownTagsList.length >= 1) {
            const knownLists = knownTagsList.filter((list) => list.tags.some((tagFromList) => normalize(tagFromList) === tagName));
            if (tag.knownSource.length >= 1) {
                tag.knownSource.forEach((knownSource) => {
                    if (knownSource.source === 'import' && importsKnown) {
                        knownSource.known = true;
                        tag.known = true;
                    }
                });
            }
            if (knownLists.length >= 1) {
                knownLists.forEach((list) => {
                    tag.knownSource.push({ source: list.name, known: list.known, file: list.file });
                    if (list.known) {
                        tag.known = true;
                    }
                });
                logger.debug(`tag ${tagName} is in known list`);
            }
        }
        if (componentsList.length >= 1) {
            if (componentsList.some((rawTag) => normalize(rawTag) === tagName)) {
                tag.knownSource.push({ source: 'components', known: true, file: componentsFile });
                tag.known = true;
                logger.debug(`tag ${tagName} is in components list`);
            }
        }
        if (tag.knownSource.length <= 0) {
            tag.knownSource.push({ source: 'unknown', known: false, file: '' });
            logger.debug(`tag ${tagName} is not in components list or in a known list`);
        }
        return tag;
    });
}
export async function getKnownLists({ negateKnown, knownFrameworks, knownTags, knownTagsFile, cachePath }) {
    const knownTagsFileContent = knownTagsFile
        ? await getJsonFileContent(knownTagsFile)
        : [];
    const knownTagsFileContentList = knownTagsFileContent.length >= 1
        ? [
            {
                name: 'file',
                tags: knownTagsFileContent,
                known: true,
                file: knownTagsFile
            }
        ]
        : [];
    const knownTagsList = knownTags.length >= 1
        ? [{ name: 'cli', tags: knownTags, known: true, file: '' }]
        : [];
    const baseTags = getBaseTags(negateKnown);
    const frameworkTags = await getFrameworkTools(knownFrameworks, cachePath);
    logger.debug(`baseTags: ${JSON.stringify(baseTags, null, 2)}`);
    logger.debug(`frameworkTags: ${JSON.stringify(frameworkTags, null, 2)}`);
    logger.debug(`knownTagsList: ${JSON.stringify(knownTagsList, null, 2)}`);
    logger.debug(`knownTagsFileContentList: ${JSON.stringify(knownTagsFileContentList, null, 2)}`);
    return [...knownTagsList, ...knownTagsFileContentList, ...frameworkTags, ...baseTags];
}
export function matchesOneOf(tag, regexMatchResult) {
    return regexMatchResult ? regexMatchResult.some((result) => result === tag) : false;
}
export function getImportsListFromFile(fileContent) {
    const importsList = [];
    const importMatches = [
        ...fileContent.matchAll(/[ ]*import [{ \n\r]*[ ]*([\w,\-\n\r ]+)[} ]* from ['"]*([@.\-/\w]+)['"]*[;]*|[ ]*import ([\w,\-\n\r ]*) [{ \n\r]*[ ]*([\w,\-\n\r ]+)[} ]* from ['"]*([@.\-/\w]+)['"]*[;]*/g)
    ];
    for (const match of importMatches) {
        const component = match[1]
            .replace(/as/gm, '')
            .replace(/default/gm, '')
            .replace(/,/gm, '')
            .replace(/ /gm, '')
            .replace(/\n/gm, ',')
            .split(',');
        const path = match[2];
        logger.debug(`Found import: ${component.join(', ')} ${path}.`);
        importsList.push({ component, path });
    }
    return importsList;
}
export function getTagsFromTemplate(linesOfFile, templateStartIndex, templateEndIndex) {
    const tagList = [];
    for (let index = templateStartIndex + 1; index <= templateEndIndex; index++) {
        const line = linesOfFile[index];
        logger.debug(`Line content: "${line}"`);
        const tagListRaw = getTagFromLine(line);
        if (tagListRaw.length >= 1) {
            logger.debug(`Tags found in line. ${tagListRaw}`);
        }
        tagList[index] = tagListRaw;
    }
    return tagList;
}
export function getTagFromLine(line) {
    const tagListRaw = line.match(/<([\w-]+)/g);
    if (tagListRaw === null) {
        logger.debug(`no tags found in line`);
        return [];
    }
    return tagListRaw
        .map((tag) => tag.replace(/</, '').trim())
        .filter((tag) => {
        const completeTag = line.match(/<([\w]+?[^ ]+?)[\W]*?>/);
        const multipleTags = completeTag?.[1].includes('>') || completeTag?.[1].includes('<');
        const endTag = line.match(/<\/([a-zA-Z0-9-_]+)>/);
        const propertyTyping = line.match(/[=:"]+?[^</]+?<\s*([a-zA-Z0-9-_]+)\s*(?=>)|[=:"]+?[^</]+?<([a-zA-Z0-9-_]*?)<\s*?\W*?([a-zA-Z0-9-_]+?)\W*?\s*?>/);
        if ((completeTag !== null &&
            tag !== completeTag?.[1] &&
            !multipleTags &&
            endTag === null &&
            propertyTyping === null) ||
            matchesOneOf(tag, propertyTyping)) {
            logger.debug(`tag ${tag} is not valide`);
            return false;
        }
        return true;
    });
}
export function getLinesForReport(linesOfFile, index) {
    return [
        ...(index - 1 >= 1 ? [{ text: linesOfFile[index - 1], index: index }] : []),
        { text: linesOfFile[index], index: index + 1 },
        ...(index + 1 <= linesOfFile.length ? [{ text: linesOfFile[index + 1], index: index + 2 }] : [])
    ];
}
