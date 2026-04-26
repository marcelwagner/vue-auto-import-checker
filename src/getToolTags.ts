import { program } from 'commander';
import { userConfig } from './config/index.ts';
import { findFrameworkByName, statistics } from './utils/index.ts';

export async function getToolTags(config: InternalConfig): Promise<{
  toolTags: string[];
  toolName: string;
}> {
  try {
    userConfig.set(config);

    const { tool, basePath, cachePath } = userConfig;

    // Start the timer.
    statistics.start();

    // Find the tool by name and ensure it's a valid tool name.
    const possibleTool: FrameworkToolItem | undefined =
      findFrameworkByName(tool);

    // If no matching tool is found
    if (!possibleTool) {
      program.error(`No tool found with the name ${tool}.`, { exitCode: -1 });
    }

    // Execute the tool with the current working directory and relative cache directory as context.
    const toolTags: string[] = await possibleTool.tool(basePath, cachePath);

    statistics.end();

    return {
      toolTags,
      toolName: possibleTool.name
    };
  } catch (error) {
    // Propagate a structured rejection so callers can handle errors consistently.
    return Promise.reject({ errorText: `Error in getToolTags: ${error}` });
  }
}
