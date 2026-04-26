import { join } from 'node:path';
import { userConfig } from './config/index.ts';
import { getComponentList } from './getComponentsList.ts';
import {
  getIdentifiedTagsList,
  getKnownLists,
  getTagsFromDirectoryPaths,
  statistics
} from './utils/index.ts';

/**
 * Recursively traverse the directory list and process each file and directory.
 *
 * - Increments directory counters.
 * - For each filesystem entry: if file -> process via `getTagsFromFile`, if directory -> recurse.
 * - Errors while reading files/directories are converted to rejected Promises unless `quiet` is enabled,
 *   in which case they are swallowed to continue best-effort scanning.
 * - Symlinks and non-file/directory entries are ignored.
 *
 * @param config - base config
 * @returns promise resolves when the directory and its children have been processed
 */
export async function getTags(config: InternalConfig): Promise<Tag[]> {
  try {
    userConfig.set(config);

    const {
      basePath,
      projectPaths,
      negateKnown,
      knownFrameworks,
      knownTags,
      knownTagsFile,
      cachePath,
      componentsFile,
      importsKnown
    } = userConfig;

    // Start the timer.
    statistics.start();

    // Start the recursive scan of the project directory.
    const rawTagsList: Tag[] = await getTagsFromDirectoryPaths(
      basePath,
      projectPaths
    );

    // Build the aggregated known list from framework plugins, base tags, user-supplied tags and user-supplied JSON file.
    const knownTagsList: KnownList[] = await getKnownLists({
      negateKnown,
      knownFrameworks,
      knownTags,
      knownTagsFile: knownTagsFile ? join(basePath, knownTagsFile) : '',
      cachePath: join(basePath, cachePath)
    });

    // Build the list of registered components to exclude them from unknown detection.
    const componentsList: string[] = componentsFile
      ? await getComponentList(userConfig)
      : [];

    // Run the actual tag identification logic.
    const identifiedTags = await getIdentifiedTagsList({
      knownTagsList,
      componentsList,
      componentsFile,
      tags: rawTagsList,
      importsKnown
    });

    statistics.end();

    return identifiedTags;
  } catch (error) {
    // Propagate a structured rejection so callers can handle errors consistently.
    return Promise.reject({ errorText: `Error in getTags: ${error}` });
  }
}
