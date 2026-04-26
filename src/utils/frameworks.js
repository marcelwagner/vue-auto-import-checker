import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { frameworksTools, toolsFileExt } from "../config/index.js";
import { getJsonFileContent, logger, normalize } from "./index.js";
export async function getFrameworkTools(knownFrameworks, cachePath) {
    return Promise.all(frameworksTools.map((frameworkTool) => {
        const known = knownFrameworks.includes(frameworkTool.name);
        return getFramework(cachePath, frameworkTool, known);
    }));
}
export function getFrameworkList(knownFrameworks) {
    const frameworks = [];
    knownFrameworks.forEach((framework) => {
        const foundFramework = findFrameworkByName(framework);
        if (foundFramework) {
            frameworks.push(foundFramework.name);
        }
        else {
            logger.debug(`Unknown ignoreframework ${framework}`);
        }
    });
    return frameworks;
}
export async function getFramework(userGeneratedPath, frameworkTool, known) {
    const localPluginFile = join(userGeneratedPath, `${frameworkTool?.file}.${toolsFileExt}`);
    const localPluginFileExists = existsSync(localPluginFile);
    return {
        name: frameworkTool.name,
        tags: localPluginFileExists
            ? await getJsonFileContent(localPluginFile)
            : frameworkTool.tags || [],
        file: localPluginFileExists ? localPluginFile : frameworkTool.source,
        known
    };
}
export function findFrameworkByName(name) {
    return frameworksTools.find((framework) => framework.name === normalize(name));
}
