import fsPromise from 'node:fs/promises';
import path from 'node:path';

import type { VAIC_Config } from '../types/config.interface.ts';
import { getFileContent } from './utils/fileUtils.ts';
import { getComponentList } from './utils/getComponentList.ts';
import { getCustomTagList } from './utils/getCustomTagList.ts';
import { addToUnknownTags, getTagFromLine, isTagInIgnoreList } from './utils/tagUtils.ts';

export default async function ({
  componentsFile,
  projectPath,
  userGeneratedPath,
  noHtml,
  noSvg,
  noVue,
  noVueRouter,
  vueUse,
  vuetify,
  customTags,
  quiet,
  basePath
}: VAIC_Config): Promise<ComponentSearch> {
  const getUnknownTagsFromFile = async (file: string, stats: Stats, unknownTags: UnknownTags[]) => {
    stats.fileCounter++;

    const fileContent = await getFileContent(file);

    // Is it a template file?
    const isTemplate = fileContent.includes('<template>');

    if (!isTemplate) {
      return;
    }

    stats.templateFiles++;

    let script = false;
    let style = false;

    // Get lines of file
    const linesOfFile = fileContent.split(/\n/);

    linesOfFile.forEach((line: string, index: number) => {
      if (line.match(/<script[\w\W]*/)) {
        script = true;

        if (style) {
          style = false;
        }
      }

      if (line.match(/<\/script>/)) {
        script = false;
      }

      if (line.match(/<style[\w\W]*/)) {
        style = true;

        if (script) {
          script = false;
        }
      }

      if (line.match(/<\/style>/)) {
        style = false;
      }

      if (script || style) {
        return;
      }

      // No script or style section, must be a template section
      const tagListRaw = getTagFromLine(line);

      // No matching tag found in line
      if (tagListRaw.length <= 0) {
        return;
      }

      tagListRaw.forEach((tagRaw: string) => {
        const tag = tagRaw.replace(/-/g, '').toLowerCase();

        const ignoreListConfig: IgnoreListConfig = {
          noHtml,
          noSvg,
          noVue,
          noVueRouter,
          vuetifyTags,
          vueUseTags,
          customTags
        };

        // Is tag in any ignore list?
        if (isTagInIgnoreList(tag, ignoreListConfig)) {
          return;
        }

        // Is tag in component list?
        if (componentsList.map(component => component.tag).includes(tag)) {
          return;
        }

        // Tag is unknown!
        addToUnknownTags(unknownTags, index, tagRaw, linesOfFile, file);
      });
    });

    return;
  };

  const getUnknownTagsFromDirectory = async (
    directoryPath: string,
    stats: Stats,
    unknownTags: UnknownTags[]
  ) => {
    stats.dirCounter++;

    const entries = await fsPromise.readdir(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directoryPath, entry.name);

      if (entry.isFile()) {
        // Process file
        try {
          await getUnknownTagsFromFile(fullPath, stats, unknownTags);
        } catch (error) {
          if (!quiet) {
            return Promise.reject({
              errorText: `Error reading file ${fullPath}: ${JSON.stringify(error)}`
            });
          }
        }
      } else if (entry.isDirectory()) {
        // Recursive call for subfolders
        try {
          await getUnknownTagsFromDirectory(fullPath, stats, unknownTags);
        } catch (error) {
          if (!quiet) {
            return Promise.reject({
              errorText: `Error reading path ${fullPath}: ${JSON.stringify(error)}`
            });
          }
        }
      } else {
        // Symlinks, nothing to do here
      }
    }
  };

  const startTime = Date.now();

  const stats: Stats = {
    fileCounter: 0,
    dirCounter: 0,
    templateFiles: 0,
    startTime,
    endTime: startTime
  };

  const unknownTags: UnknownTags[] = [];

  const vueUseTags = vueUse
    ? await getCustomTagList(userGeneratedPath, basePath, 'vueUseTags')
    : ([] as string[]);

  const vuetifyTags = vuetify
    ? await getCustomTagList(userGeneratedPath, basePath, 'vuetifyTags')
    : ([] as string[]);

  const componentsList = await getComponentList(componentsFile);

  await getUnknownTagsFromDirectory(projectPath, stats, unknownTags);

  stats.endTime = Date.now();

  return {
    stats,
    unknownTags,
    componentsList
  };
}
