#!/usr/bin/env node
import { program } from 'commander';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import getUnknownTags, { createLogger, currentDateTime, findFrameworkByName, getBaseTagsList, getFrameworkList, getKnownComponentList, getUniqueFromList, prepareCommander, writeComponents, writeConfig, writeFinalState, writeResult, writeStats, writeToolsResult } from "./index.js";
(async () => {
    const basePath = process.cwd() || '';
    const { knownFrameworks, negateKnown, knownTags, knownTagsFile, showStats, showResult, componentsFile, projectPaths, tool, cachePath, kafka, importsKnown, quiet, debug } = prepareCommander();
    global.quiet = Boolean(quiet);
    createLogger(debug);
    if (tool) {
        try {
            const possibleTool = findFrameworkByName(tool);
            if (!possibleTool) {
                program.error(`No tool found with the name ${tool}.`, { exitCode: -1 });
            }
            if (!quiet) {
                logger.info(`Running tool ${possibleTool.name}...`);
            }
            const toolTags = await possibleTool.tool(basePath, cachePath);
            if (!quiet) {
                writeToolsResult(possibleTool.name, toolTags);
            }
            const foundText = toolTags.length >= 1
                ? `Found ${toolTags.length} ${possibleTool.name} tag${toolTags.length >= 2 ? 's' : ''}`
                : `No ${possibleTool.name} tags found`;
            writeFinalState(false, `${currentDateTime()}: ${foundText}`, 0);
        }
        catch (error) {
            program.error(`Tool error ${error?.errorText ? error?.errorText : error}`, {
                exitCode: -1
            });
        }
        logger.end();
        return;
    }
    if (componentsFile && projectPaths.length <= 0) {
        try {
            const componentsFilePath = join(basePath, componentsFile);
            if (!existsSync(componentsFilePath)) {
                program.error(`No components file found at ${componentsFilePath}.`, { exitCode: -1 });
            }
            if (!quiet) {
                logger.info(`Listing components from ${componentsFilePath}...`);
            }
            const componentsList = await getKnownComponentList(basePath, componentsFile);
            if (!quiet) {
                writeComponents(componentsList);
            }
            const foundText = componentsList.length >= 1
                ? `Found ${componentsList.length} component${componentsList.length >= 2 ? 's' : ''}`
                : `No components found`;
            writeFinalState(false, `${currentDateTime()}: ${foundText}`, 0);
        }
        catch (error) {
            program.error(`Component list error ${error?.errorText ? error?.errorText : error}`, {
                exitCode: -1
            });
        }
        logger.end();
        return;
    }
    const knownFrameworkList = knownFrameworks.length >= 1 ? getFrameworkList(knownFrameworks) : [];
    const baseTagsList = negateKnown.length >= 1 ? getBaseTagsList(negateKnown) : [];
    const config = {
        componentsFile,
        projectPaths,
        negateKnown: baseTagsList,
        knownFrameworks: knownFrameworkList,
        knownTags,
        knownTagsFile,
        cachePath,
        basePath,
        importsKnown,
        debug,
        kafka
    };
    if (kafka) {
        try {
            const { tagsList, stats } = await getUnknownTags(config);
            const uniqueTagsList = getUniqueFromList(tagsList.map((tag) => tag.tagName));
            const filesList = getUniqueFromList(tagsList.map((tag) => tag.file));
            if (!quiet) {
                if (showResult) {
                    writeResult(tagsList, kafka);
                }
                if (debug) {
                    writeConfig(config, showResult);
                }
                if (showStats) {
                    writeStats({ stats, filesList, tagsList, uniqueTagsList, showResult, kafka });
                }
            }
            const foundText = tagsList.length >= 1
                ? `Found ${uniqueTagsList.length} unique tag${uniqueTagsList.length >= 2 ? 's' : ''} in ${tagsList.length} line${tagsList.length >= 2 ? 's' : ''} in ${filesList.length} file${filesList.length >= 2 ? 's' : ''}`
                : `No tags found`;
            logger.info(`${currentDateTime()}: ${foundText}`);
        }
        catch (error) {
            program.error(`Kafka error: ${error?.errorText ? error?.errorText : error}`, {
                exitCode: -1
            });
        }
        logger.end();
        return;
    }
    try {
        const { unknownTagsList, stats } = await getUnknownTags(config);
        const uniqueTagsList = getUniqueFromList(unknownTagsList.map((tag) => tag.tagName));
        const filesList = getUniqueFromList(unknownTagsList.map((tag) => tag.file));
        if (!quiet) {
            if (showResult) {
                writeResult(unknownTagsList, kafka);
            }
            if (debug) {
                writeConfig(config, showResult);
            }
            if (showStats) {
                writeStats({
                    stats,
                    filesList,
                    tagsList: unknownTagsList,
                    uniqueTagsList,
                    showResult,
                    kafka
                });
            }
        }
        const foundText = unknownTagsList.length >= 1
            ? `Found ${uniqueTagsList.length} unique unknown tag${uniqueTagsList.length >= 2 ? 's' : ''} in ${unknownTagsList.length} line${unknownTagsList.length >= 2 ? 's' : ''} in ${filesList.length} file${filesList.length >= 2 ? 's' : ''}`
            : `No unknown tags found`;
        writeFinalState(unknownTagsList.length >= 1, `${currentDateTime()}: ${foundText}`, unknownTagsList.length);
    }
    catch (error) {
        program.error(`Program error: ${error?.errorText ? error?.errorText : error}`, {
            exitCode: -1
        });
    }
    logger.end();
    return;
})();
