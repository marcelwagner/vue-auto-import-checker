#!/usr/bin/env node
import { program } from 'commander';
import { getComponentList, getFrameworkList, getKnownBaseTagsList, getTags, getToolTags, getUnknownTags, prepareCommander, statistics, writeComponentsOutput, writeConfig, writeTagsOutput, writeToolOutput } from "./index.js";
import { userConfig } from "./src/config/index.js";
async function main() {
    const basePath = process.cwd() || '';
    const commanderOptions = prepareCommander();
    const { knownFrameworks, negateKnown, componentsFile, projectPaths, tool, kafka, outputFormat, showConfig } = commanderOptions;
    userConfig.set({
        ...commanderOptions,
        negateKnown: negateKnown.length >= 1 ? getKnownBaseTagsList(negateKnown) : [],
        knownFrameworks: knownFrameworks.length >= 1 ? getFrameworkList(knownFrameworks) : [],
        outputFormat: outputFormat,
        basePath
    });
    statistics.start();
    if (showConfig) {
        try {
            writeConfig(commanderOptions);
            return;
        }
        catch (error) {
            program.error(`Show config error ${error?.errorText ? error?.errorText : error}`, {
                exitCode: -1
            });
        }
    }
    if (tool) {
        try {
            const { toolTags, toolName } = await getToolTags(userConfig);
            writeToolOutput(toolTags, toolName);
            return;
        }
        catch (error) {
            program.error(`Tool error ${error?.errorText ? error?.errorText : error}`, {
                exitCode: -1
            });
        }
    }
    if (componentsFile && projectPaths.length <= 0) {
        try {
            const componentsList = await getComponentList(userConfig);
            writeComponentsOutput(componentsList);
            return;
        }
        catch (error) {
            program.error(`Component list error ${error?.errorText ? error?.errorText : error}`, {
                exitCode: -1
            });
        }
    }
    if (kafka) {
        try {
            const tagsList = await getTags(userConfig);
            writeTagsOutput(tagsList);
            return;
        }
        catch (error) {
            program.error(`Kafka error: ${error?.errorText ? error?.errorText : error}`, {
                exitCode: -1
            });
        }
    }
    try {
        const unknownTagsList = await getUnknownTags(userConfig);
        writeTagsOutput(unknownTagsList);
    }
    catch (error) {
        program.error(`Program error: ${error?.errorText ? error?.errorText : error}`, {
            exitCode: -1
        });
    }
}
await main();
