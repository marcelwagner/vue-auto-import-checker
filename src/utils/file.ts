import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { logger } from './logger.ts';

/**
 * Read a file as UTF-8 text.
 *
 * This helper wraps `fs/promises.readFile` to provide a consistent
 * promise-based API and unified error message on failure.
 *
 * @param filePath - path to the file to read
 * @returns promise that resolves with the file content as a string
 */
export async function getFileContent(filePath: string): Promise<string> {
  try {
    // Read the file using UTF-8 encoding and return the resulting string.
    return readFile(filePath, 'utf8');
  } catch (error) {
    // Normalize the rejection to a readable string so callers get a consistent error shape.
    return Promise.reject({
      errorText:
        `Error getting file content from file ${filePath} ` +
        JSON.stringify(error)
    });
  }
}

/**
 * Load and parse a JSON file.
 *
 * This function reads the file using `getFileContent` and parses the
 * content with `JSON.parse`. It rejects with a descriptive error
 * message on read or parse failures.
 *
 * @param filePath - path to the JSON file
 * @returns promise that resolves with the parsed JSON (expected as `string[]` in current usage)
 */
export async function getJsonFileContent(filePath: string): Promise<string[]> {
  try {
    const jsonFileContent: string = await getFileContent(filePath);
    return JSON.parse(jsonFileContent);
  } catch (error) {
    return Promise.reject({
      errorText:
        `Error getting json file content from files ${filePath} ` +
        JSON.stringify(error)
    });
  }
}

/**
 * Write a JSON file with the given content.
 *
 * @param dir - directory to write the file in
 * @param tagsFile - name of the file to write (e.g., 'vuetifyTags.json')
 * @param componentsList - array of component tags to write to the file
 * @returns promise that resolves when the file is written successfully
 */
export async function writeCustomPluginFile(
  dir: string,
  tagsFile: string,
  componentsList: string[]
): Promise<void> {
  if (componentsList.length >= 1) {
    const localDirExists: boolean = existsSync(dir);

    if (!localDirExists) {
      logger.debug(`localDir ${dir} will be made`);
      await mkdir(dir);
    }

    const localTagsFile: string = join(dir, tagsFile);

    logger.debug(`localTagsFile ${localTagsFile}`);

    await writeFile(
      localTagsFile,
      `${JSON.stringify(componentsList, null, 2)}\n`,
      {
        flag: 'w+',
        encoding: 'utf-8'
      }
    );
  }
}
