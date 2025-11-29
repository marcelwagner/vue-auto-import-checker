import fs from 'node:fs/promises';
import path from 'node:path';

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
 * @param componentsFilePath - path pointing to the components declaration file
 * @returns promise resolving to an array of objects with `tag` (lowercased) and `rawTag`
 */
export async function getComponentList(componentsFilePath: string): Promise<ComponentTag[]> {
  try {
    // Ensure the provided path is normalized and ready for reading.
    const componentsFile = path.join(componentsFilePath);

    // Read file content as text.
    const componentsFileContent = await fs.readFile(componentsFile, 'utf8');

    // Find the exported GlobalComponents interface block. The regex targets:
    // "export interface GlobalComponents { <anything until matching closing brace> }"
    const componentsListRaw = componentsFileContent.match(
      /[\W]*export interface GlobalComponents \{\W[\w\W][^}]+\W  \}/m
    );

    // Accumulator for parsed component entries.
    const componentsList: { tag: string; rawTag: string }[] = [];

    if (componentsListRaw?.[0]) {
      // Remove the interface header and trailing brace, then split into lines.
      componentsListRaw[0]
        .replace(/[\W]*export interface GlobalComponents \{\W/, '')
        .replace(/[\W]*\}/, '')
        .split(/[\n\r]+}/)
        .forEach(line => {
          // Trim whitespace and remove the TypeScript type suffix that looks like:
          // ": typeof import('...')"
          const rawMatch = line.trim().replace(/: typeof import\('[a-zA-Z0-9-./'[\]()",]+/, '');
          // Store both the raw tag and a normalized lowercased version.
          componentsList.push({ tag: rawMatch.toLowerCase(), rawTag: rawMatch });
        });
    }

    // Return the extracted list (caller expects ComponentTag[]).
    return componentsList;
  } catch (error) {
    // Propagate a structured rejection so callers can handle errors consistently.
    return Promise.reject({ errorText: `Error in getComponentList: ${error}` });
  }
}
