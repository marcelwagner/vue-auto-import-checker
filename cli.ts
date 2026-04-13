#!/usr/bin/env node

import { program } from 'commander';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import getUnknownTags, {
  createLogger,
  currentDateTime,
  findFrameworkByName,
  getBaseTagsList,
  getFrameworkList,
  getKnownComponentList,
  getUniqueFromList,
  prepareCommander,
  type VAIC_ComponentSearch,
  type VAIC_Config,
  writeComponents,
  writeConfig,
  writeFinalState,
  writeResult,
  writeStats,
  writeToolsResult
} from './index.ts';

// Main async entry: choose between tool execution, listing components or full scan.
(async (): Promise<void> => {
  // Base path for resolving relative paths.
  const basePath: string = process.cwd() || '';
  // Parse command-line arguments and normalize options.
  const {
    knownFrameworks,
    negateKnown,
    knownTags,
    knownTagsFile,
    showStats,
    showResult,
    componentsFile,
    projectPaths,
    tool,
    cachePath,
    kafka,
    importsKnown,
    quiet,
    debug
  }: CommanderInit = prepareCommander();
  // Set global quiet flag for downstream modules to conditionally suppress output.
  global.quiet = Boolean(quiet);

  // Initialize the logger with the debug setting so downstream modules can emit logs.
  createLogger(debug);

  // Tool mode: when a tool is specified, execute it and exit immediately with its results.
  if (tool) {
    try {
      // Find the tool by name and ensure it's a valid tool name.
      const possibleTool: FrameworkToolItem | undefined = findFrameworkByName(tool);

      // If no matching tool is found
      if (!possibleTool) {
        program.error(`No tool found with the name ${tool}.`, { exitCode: -1 });
      }

      if (!quiet) {
        logger.info(`Running tool ${possibleTool.name}...`);
      }

      // Execute the tool with the current working directory and relative cache directory as context.
      const toolTags: string[] = await possibleTool.tool(basePath, cachePath);

      if (!quiet) {
        // Present tool output in human-friendly format.
        writeToolsResult(possibleTool.name, toolTags);
      }

      const foundText: string =
        toolTags.length >= 1
          ? `Found ${toolTags.length} ${possibleTool.name} tag${toolTags.length >= 2 ? 's' : ''}`
          : `No ${possibleTool.name} tags found`;

      // Finalize with exit code 0 (success).
      writeFinalState(false, `${currentDateTime()}: ${foundText}`, 0);
    } catch (error: any) {
      program.error(`Tool error ${error?.errorText ? error?.errorText : error}`, {
        exitCode: -1
      });
    }

    return;
  }

  // Component-list mode: when only a component file path is specified, list components and exit.
  if (componentsFile && projectPaths.length <= 0) {
    try {
      const componentsFilePath: string = join(basePath, componentsFile);

      // Validate that the specified components file exists before attempting to read it.
      if (!existsSync(componentsFilePath)) {
        program.error(`No components file found at ${componentsFilePath}.`, { exitCode: -1 });
      }

      if (!quiet) {
        logger.info(`Listing components from ${componentsFilePath}...`);
      }

      // Read and parse the component export file to produce a list of registered components.
      const componentsList: string[] = await getKnownComponentList(basePath, componentsFile);

      if (!quiet) {
        // Display discovered components.
        writeComponents(componentsList);
      }

      const foundText: string =
        componentsList.length >= 1
          ? `Found ${componentsList.length} component${componentsList.length >= 2 ? 's' : ''}`
          : `No components found`;

      // Exit with success.
      writeFinalState(false, `${currentDateTime()}: ${foundText}`, 0);
    } catch (error: any) {
      program.error(`Component list error ${error?.errorText ? error?.errorText : error}`, {
        exitCode: -1
      });
    }

    return;
  }

  // Get frameworks from known frameworks lists
  const knownFrameworkList: Framework[] =
    knownFrameworks.length >= 1 ? getFrameworkList(knownFrameworks) : [];
  // Get base tags list from
  const baseTagsList: Known[] = negateKnown.length >= 1 ? getBaseTagsList(negateKnown) : [];

  const config: VAIC_Config = {
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

  // Full scan flow: Output every tag if it is known or not
  if (kafka) {
    try {
      // Run the main scanning routine using the tag list
      const { tagsList, stats }: VAIC_ComponentSearch = await getUnknownTags(config);

      // Compute unique tag names and unique files for summary/stats.
      const uniqueTagsList: string[] = getUniqueFromList(
        tagsList.map((tag: Tag): string => tag.tagName)
      );
      const filesList: string[] = getUniqueFromList(tagsList.map((tag: Tag): string => tag.file));

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

      const foundText: string =
        tagsList.length >= 1
          ? `Found ${uniqueTagsList.length} unique tag${uniqueTagsList.length >= 2 ? 's' : ''} in ${tagsList.length} line${tagsList.length >= 2 ? 's' : ''} in ${filesList.length} file${filesList.length >= 2 ? 's' : ''}`
          : `No tags found`;

      logger.info(`${currentDateTime()}: ${foundText}`);
    } catch (error: any) {
      program.error(`Kafka error: ${error?.errorText ? error?.errorText : error}`, {
        exitCode: -1
      });
    }

    return;
  }

  // Full scan flow: Inspect project files and report unknown tags, respecting known rules.
  try {
    // Run the main scanning routine, use unknown tags
    const { unknownTagsList, stats }: VAIC_ComponentSearch = await getUnknownTags(config);

    // Compute unique tag names and unique files for summary/stats.
    const uniqueTagsList: string[] = getUniqueFromList(
      unknownTagsList.map((tag: Tag): string => tag.tagName)
    );
    const filesList: string[] = getUniqueFromList(
      unknownTagsList.map((tag: Tag): string => tag.file)
    );

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

    const foundText: string =
      unknownTagsList.length >= 1
        ? `Found ${uniqueTagsList.length} unique unknown tag${uniqueTagsList.length >= 2 ? 's' : ''} in ${unknownTagsList.length} line${unknownTagsList.length >= 2 ? 's' : ''} in ${filesList.length} file${filesList.length >= 2 ? 's' : ''}`
        : `No unknown tags found`;

    writeFinalState(
      unknownTagsList.length >= 1,
      `${currentDateTime()}: ${foundText}`,
      unknownTagsList.length
    );
  } catch (error: any) {
    program.error(`Program error: ${error?.errorText ? error?.errorText : error}`, {
      exitCode: -1
    });
  }

  return;
})();
