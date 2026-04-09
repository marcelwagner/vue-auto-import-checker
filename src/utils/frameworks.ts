import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { frameworksTools, toolsFileExt } from '../config/index.ts';
import { getJsonFileContent, normalize } from './index.ts';

/**
 * Load the list of known frameworks and their tags from the user-provided JSON files.
 *
 * @param knownFrameworks - list of known frameworks
 * @param cachePath - path to the cache directory
 * @returns promise of KnownList[]
 */
export async function getFrameworkTools(
  knownFrameworks: Framework[],
  cachePath: string
): Promise<KnownList[]> {
  return Promise.all(
    frameworksTools.map((frameworkTool: FrameworkToolItem): Promise<KnownList> => {
      const known: boolean = knownFrameworks.includes(frameworkTool.name as Framework);
      return getFramework(cachePath, frameworkTool, known);
    })
  );
}

/** Convert the list of known frameworks to a list of FrameworkToolItem
 *
 * @param knownFrameworks - list of known frameworks
 * @returns array of FrameworkToolItem
 */
export function getFrameworkList(knownFrameworks: string[]): Framework[] {
  const frameworks: Framework[] = [];

  knownFrameworks.forEach((framework: string): void => {
    const foundFramework: FrameworkToolItem | undefined = findFrameworkByName(framework);
    if (foundFramework) {
      frameworks.push(foundFramework.name as Framework);
    } else {
      logger.debug(`Unknown ignoreframework ${framework}`);
    }
  });

  return frameworks;
}

/**
 * Load a custom JSON tag list provided by the user, falling back to a built-in plugin file.
 *
 * Behavior:
 * - Construct the expected path for a user-provided JSON file: <userGeneratedPath>/<file>.json
 * - If that file exists, read and return its parsed content.
 * - Otherwise, read and return the default file located at <basePath>/src/plugins/<file>.json
 *
 * @param userGeneratedPath - basePath of the JSON file
 * @param frameworkTool - frameworkTool
 * @param known - true if the framework is known
 * @returns Promise of KnownList
 */
export async function getFramework(
  userGeneratedPath: string,
  frameworkTool: FrameworkToolItem,
  known: boolean
): Promise<KnownList> {
  // Build the path to a potential user-provided JSON file, e.g. /path/to/user/<file>.json
  const localPluginFile: string = join(userGeneratedPath, `${frameworkTool?.file}.${toolsFileExt}`);

  // Quick synchronous existence check to decide which file to load
  const localPluginFileExists: boolean = existsSync(localPluginFile);

  // If a user file exists, load and return it; otherwise return null
  return {
    name: frameworkTool.name as Source,
    tags: localPluginFileExists
      ? await getJsonFileContent(localPluginFile)
      : frameworkTool.tags || [],
    file: localPluginFileExists ? localPluginFile : frameworkTool.source,
    known
  };
}

/**
 * Find a framework by name.
 *
 * @param name - name of the framework
 * @returns FrameworkToolItem | undefined
 */
export function findFrameworkByName(name: string): FrameworkToolItem | undefined {
  return frameworksTools.find(
    (framework: FrameworkToolItem): boolean => framework.name === normalize(name)
  );
}
