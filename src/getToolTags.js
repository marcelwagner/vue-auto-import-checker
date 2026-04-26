import { program } from 'commander';
import { userConfig } from "./config/index.js";
import { findFrameworkByName, statistics } from "./utils/index.js";
export async function getToolTags(config) {
    try {
        userConfig.set(config);
        const { tool, basePath, cachePath } = userConfig;
        statistics.start();
        const possibleTool = findFrameworkByName(tool);
        if (!possibleTool) {
            program.error(`No tool found with the name ${tool}.`, { exitCode: -1 });
        }
        const toolTags = await possibleTool.tool(basePath, cachePath);
        statistics.end();
        return {
            toolTags,
            toolName: possibleTool.name
        };
    }
    catch (error) {
        return Promise.reject({ errorText: `Error in getToolTags: ${error}` });
    }
}
