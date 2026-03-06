#!/usr/bin/env node

import { program } from 'commander';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { frameworksTools } from './config.ts';
import getUnknownTags, {
  createLogger,
  currentDateTime,
  findFrameworkByName,
  getBaseTagsList,
  getFrameworkList,
  getKnownComponentList,
  getUniqueFromList,
  prepareCommander,
  type VAIC_Config,
  writeComponents,
  writeConfig,
  writeFinalState,
  writeResult,
  writeStats,
  writeToolsResult
} from './index.ts';

// Main async entry: choose between tool execution, listing components, or full scan.
(async () => {
  // Defaults
  const basePath: string = process.cwd() || '';

  const {
    knownFrameworks,
    negateKnown,
    knownTags,
    knownTagsFile,
    showStats,
    showResult,
    componentsFile,
    projectPath,
    tool,
    cachePath,
    kafka,
    importsKnown,
    quiet,
    debug
  } = prepareCommander();

  global.quiet = Boolean(quiet);

  // Initialize logger with debug setting so downstream modules can emit logs.
  createLogger(debug);

  // Tool flow: execute a named helper tool that returns tags (e.g. framework tags).
  if (tool) {
    try {
      const possibleTool: FrameworkToolItem | undefined = findFrameworkByName(tool);

      if (!possibleTool) {
        // Commander prints an error message and exits with the provided code.
        program.error(`No tool found with the name ${tool}.`, { exitCode: -1 });
      }

      if (!quiet) {
        logger.info(`Running tool ${possibleTool.name}...`);
      }

      // Execute the tool with the current working directory as context.
      const toolTags: string[] = await possibleTool.tool(basePath, cachePath);
      const toolName: string = tool.split('-')[0];

      if (!quiet) {
        // Present tool output in human-friendly form unless quiet mode is enabled.
        writeToolsResult(toolName, toolTags);
      }

      // Create a short summary line describing whether tags were found.
      const foundText: string =
        toolTags.length >= 1
          ? `Found ${toolTags.length} ${toolName} tag${toolTags.length >= 2 ? 's' : ''}`
          : `No ${toolName} tags found`;

      // Finalize with exit code 0 (success).
      writeFinalState(false, `${currentDateTime()}: ${foundText}`, 0);
    } catch (error: any) {
      // Propagate tool-specific errors via commander for consistent CLI UX.
      program.error(`Tool error ${error?.errorText ? error?.errorText : error}`, {
        exitCode: -1
      });
    }

    logger.end();

    return;
  }

  // Component-list mode: when only a components file is specified, list components and exit.
  if (componentsFile && !projectPath) {
    try {
      const componentsFilePath: string = join(basePath, componentsFile);

      if (!existsSync(componentsFilePath)) {
        // Commander prints an error message and exits with the provided code.
        program.error(`No components file found at ${componentsFilePath}.`, { exitCode: -1 });
      }

      if (!quiet) {
        logger.info(`Listing components from ${componentsFilePath}...`);
      }

      // Read and parse the component export file to produce a list of registered components.
      const componentsList: string[] = await getKnownComponentList(basePath, componentsFile);

      if (!quiet) {
        // Display discovered components unless running in quiet mode.
        writeComponents(componentsList);
      }

      // Summary about found components (pluralization handled).
      const foundText: string =
        componentsList.length >= 1
          ? `Found ${componentsList.length} component${componentsList.length >= 2 ? 's' : ''}`
          : `No components found`;

      // Exit with success.
      writeFinalState(false, `${currentDateTime()}: ${foundText}`, 0);
    } catch (error: any) {
      // Surface parsing or file IO errors to the user via commander.
      program.error(`Component list error ${error?.errorText ? error?.errorText : error}`, {
        exitCode: -1
      });
    }

    logger.end();

    return;
  }

  // Component-list mode: when only a components file is specified, list components and exit.
  if (projectPath && kafka) {
    // Full scan flow: inspect project files and report unknown tags, respecting known rules.
    try {
      const config: VAIC_Config = {
        componentsFile,
        projectPath,
        negateKnown: [] as Known[],
        knownFrameworks: frameworksTools.map(framework => framework.name as Framework),
        knownTags,
        knownTagsFile,
        cachePath,
        basePath,
        importsKnown,
        debug
      };

      // Run the main scanning routine with resolved and normalized paths/options.
      const { tagsList, stats } = await getUnknownTags(config);

      // Compute unique tag names and unique files for summary/stats.
      const uniqueTagsList: string[] = getUniqueFromList(tagsList.map(tag => tag.tagName));
      const filesList: string[] = getUniqueFromList(tagsList.map(tag => tag.file));

      // Respect quiet mode: conditionally print detailed result and/or statistics.
      if (!quiet) {
        if (showResult) {
          writeResult(tagsList, kafka);
        }

        writeConfig(config, showResult);

        if (showStats) {
          writeStats({ stats, filesList, tagsList, uniqueTagsList, showResult });
        }
      }
      // Build a human-readable summary line with counts and pluralization.
      const foundText: string =
        tagsList.length >= 1
          ? `Found ${uniqueTagsList.length} unique tag${uniqueTagsList.length >= 2 ? 's' : ''} in ${tagsList.length} line${tagsList.length >= 2 ? 's' : ''} in ${filesList.length} file${filesList.length >= 2 ? 's' : ''}`
          : `No tags found`;

      // Finalize: exit code indicates if unknown tags were detected.
      logger.info(`${currentDateTime()}: ${foundText}`);
    } catch (error: any) {
      // Surface scanning or IO errors consistently via commander.
      program.error(`Kafka error: ${error?.errorText ? error?.errorText : error}`, {
        exitCode: -1
      });
    }

    logger.end();

    return;
  }

  // Full scan flow: inspect project files and report unknown tags, respecting known rules.
  try {
    // Resolve framework known frameworks lists
    const knownFrameworkList: Framework[] =
      knownFrameworks.length >= 1 ? getFrameworkList(knownFrameworks) : [];
    // Resolve negated known tags list
    const baseTagsList: Known[] = negateKnown.length >= 1 ? getBaseTagsList(negateKnown) : [];

    const config: VAIC_Config = {
      componentsFile,
      projectPath,
      negateKnown: baseTagsList,
      knownFrameworks: knownFrameworkList,
      knownTags,
      knownTagsFile,
      cachePath,
      basePath,
      importsKnown,
      debug
    };

    // Run the main scanning routine with resolved and normalized paths/options.
    const { unknownTagsList, stats } = await getUnknownTags(config);

    // Compute unique tag names and unique files for summary/stats.
    const uniqueTagsList: string[] = getUniqueFromList(unknownTagsList.map(tag => tag.tagName));
    const filesList: string[] = getUniqueFromList(unknownTagsList.map(tag => tag.file));

    // Respect quiet mode: conditionally print detailed result and/or statistics.
    if (!quiet) {
      if (showResult) {
        writeResult(unknownTagsList, kafka);
      }

      writeConfig(config, showResult);

      if (showStats) {
        writeStats({ stats, filesList, tagsList: unknownTagsList, uniqueTagsList, showResult });
      }
    }
    // Build unknown string if needed
    // Build a human-readable summary line with counts and pluralization.
    const foundText: string =
      unknownTagsList.length >= 1
        ? `Found ${uniqueTagsList.length} unique unknown tag${uniqueTagsList.length >= 2 ? 's' : ''} in ${unknownTagsList.length} line${unknownTagsList.length >= 2 ? 's' : ''} in ${filesList.length} file${filesList.length >= 2 ? 's' : ''}`
        : `No unknown tags found`;

    // Finalize: exit code indicates if unknown tags were detected.
    writeFinalState(
      unknownTagsList.length >= 1,
      `${currentDateTime()}: ${foundText}`,
      unknownTagsList.length
    );
  } catch (error: any) {
    // Surface scanning or IO errors consistently via commander.
    program.error(`Program error: ${error?.errorText ? error?.errorText : error}`, {
      exitCode: -1
    });
  }

  logger.end();

  return;
})();
