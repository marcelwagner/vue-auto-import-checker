import fs from 'node:fs';
import path from 'node:path';
import { getJsonFileContent } from './file.ts';

/**
 * Load a custom JSON tag list provided by the user, falling back to a built-in plugin file.
 *
 * Behavior:
 * - Construct the expected path for a user-provided JSON file: <userGeneratedPath>/<file>.json
 * - If that file exists, read and return its parsed content.
 * - Otherwise, read and return the default file located at <basePath>/src/plugins/<file>.json
 *
 * @param userGeneratedPath - directory where user-provided JSON files may exist
 * @param basePath - project base directory used to resolve the default plugin file
 * @param file - basename of the JSON file (without the `.json` extension)
 * @returns array of strings from the chosen file
 */
export async function getCustomTagList(userGeneratedPath: string, basePath: string, file: string) {
  // Build the path to a potential user-provided JSON file, e.g. /path/to/user/<file>.json
  const localPluginFile = path.join(userGeneratedPath, `${file}.json`);

  // Quick synchronous existence check to decide which file to load
  const localPluginFileExists = fs.existsSync(localPluginFile);

  // If a user file exists, load and return it; otherwise return null
  return localPluginFileExists ? await getJsonFileContent(localPluginFile) : null;
}
