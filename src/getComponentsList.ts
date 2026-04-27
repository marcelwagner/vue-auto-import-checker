import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getFileContent, logger, statistics } from './utils/index.ts';
import { userConfig } from './config/index.ts';

/**
 * Read a TypeScript declaration file and extract component tags from the
 * exported `GlobalComponents` interface.
 *
 * Behavior:
 * - Resolve the provided path to the components file and read it as UTF-8 text.
 * - Use a regular expression to locate the `export interface GlobalComponents { ... }` block.
 * - Strip the surrounding interface boilerplate and split the block into lines.
 * - For each line, normalize and extract the tag name (both raw and lowercased).
 *
 * @param config - base config
 * @returns promise resolving to an array of objects with `tag` (lowercased) and `rawTag`
 */
export async function getComponentList(
  config: InternalConfig
): Promise<string[]> {
  try {
    userConfig.set(config);

    const { basePath, componentsFile } = userConfig;

    // Start the timer.
    statistics.start();

    const componentsFilePath: string = join(basePath, componentsFile);

    if (!existsSync(componentsFilePath)) {
      return Promise.reject({
        errorText: `Components file not found: ${componentsFilePath}`
      });
    }

    // Read file content as text.
    const componentsFileContent: string =
      await getFileContent(componentsFilePath);

    // Find the exported GlobalComponents interface block. The regex targets:
    // "export interface GlobalComponents { <anything until matching closing brace> }"
    const componentsListRaw: RegExpMatchArray | null =
      componentsFileContent.match(
        /\W*export interface GlobalComponents *{\W*[\w\W][^}]+\W*}/m
      );

    // Accumulator for parsed component entries.
    const componentsList: string[] = [];

    if (componentsListRaw?.[0]) {
      // Remove the interface header and trailing brace, then split into lines.
      componentsListRaw[0]
        .replace(/\W*export interface GlobalComponents \{\W/, '')
        .replace(/\W*}/, '')
        .split(/\n/)
        .forEach((line: string): void => {
          // Trim whitespace and remove the TypeScript type suffix that looks like:
          // ": typeof import('...')"
          const rawMatch: string = line
            .trim()
            .replace(/: typeof import\('[a-zA-Z0-9-./'[\]()",]+/, '');
          // Store both the raw tag and a normalized lowercased version.
          componentsList.push(rawMatch);
        });
    }

    logger.debug(`Componentlist from file ${componentsFilePath}:`);
    logger.debug(JSON.stringify(componentsList, null, 2));

    statistics.end();

    // Return the extracted list (caller expects ComponentTag[]).
    return componentsList;
  } catch (error) {
    // Propagate a structured rejection so callers can handle errors consistently.
    return Promise.reject({
      errorText: `Error in getComponentsList: ${error}`
    });
  }
}
