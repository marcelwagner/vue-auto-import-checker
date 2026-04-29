#!/usr/bin/env node

import { program } from 'commander';
import {
  getErrorText,
  getFrameworkList,
  getKnownBaseTagsList,
  statistics
} from './utils/index.ts';
import { userConfig } from './config/index.ts';
import {
  writeComponentsOutput,
  writeConfig,
  writeTagsOutput,
  writeToolOutput,
  prepareCommander
} from './cli/index.ts';
import {
  getComponentList,
  getTags,
  getToolTags,
  getUnknownTags
} from './index.ts';

// Main async entry: choose between tool execution, listing components or full scan.
async function main(): Promise<void> {
  // Base path for resolving relative paths.
  const basePath: string = process.cwd() || '';
  // Parse command-line arguments and normalize options.
  const commanderOptions: CommanderInit = prepareCommander();

  const {
    knownFrameworks,
    negateKnown,
    componentsFile,
    projectPaths,
    tool,
    kafka,
    outputFormat,
    showConfig
  } = commanderOptions;

  // Set userConfig
  userConfig.set({
    ...commanderOptions,
    negateKnown:
      negateKnown.length >= 1 ? getKnownBaseTagsList(negateKnown) : [],
    knownFrameworks:
      knownFrameworks.length >= 1 ? getFrameworkList(knownFrameworks) : [],
    outputFormat: outputFormat as OutputFormat,
    basePath
  });

  // Start the timer.
  statistics.start();

  if (showConfig) {
    try {
      writeConfig(commanderOptions);

      return;
    } catch (error: any) {
      program.error(`Show config error ${getErrorText(error)}`, {
        exitCode: -1
      });
    }
  }

  // Tool mode: when a tool is specified, execute it and exit immediately with its results.
  if (tool) {
    try {
      // Execute the tool with the current working directory and relative cache directory as context.
      const { toolTags, toolName } = await getToolTags(userConfig);

      writeToolOutput(toolTags, toolName);

      return;
    } catch (error: any) {
      program.error(`Tool error ${getErrorText(error)}`, {
        exitCode: -1
      });
    }
  }

  // Component-list mode: when only a component file path is specified, list components and exit.
  if (componentsFile && projectPaths.length <= 0) {
    try {
      // Read and parse the component export file to produce a list of registered components.
      const componentsList: string[] = await getComponentList(userConfig);

      writeComponentsOutput(componentsList);

      return;
    } catch (error: any) {
      program.error(`Component list error ${getErrorText(error)}`, {
        exitCode: -1
      });
    }
  }

  // Full scan flow: Output every tag if it is known or not
  if (kafka) {
    try {
      // Run the main scanning routine using the tag list
      const tagsList: Tag[] = await getTags(userConfig);

      writeTagsOutput(tagsList);

      return;
    } catch (error: any) {
      program.error(`Kafka error: ${getErrorText(error)}`, {
        exitCode: -1
      });
    }
  }

  // Full scan flow: Inspect project files and report unknown tags, respecting known rules.
  try {
    // Run the main scanning routine, use unknown tags
    const unknownTagsList: Tag[] = await getUnknownTags(userConfig);

    writeTagsOutput(unknownTagsList);
  } catch (error: any) {
    program.error(`Program error: ${getErrorText(error)}`, {
      exitCode: -1
    });
  }
}

await main();
