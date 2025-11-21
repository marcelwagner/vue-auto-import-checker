import fs from 'node:fs/promises';
import path from 'node:path';

import { componentList } from './plugins/componentList.ts';
import { htmlTags } from './plugins/htmlTags.ts';
import { svgTags } from './plugins/svgTags.ts';
import { vuetifyTags } from './plugins/vuetifyTags.ts';
import { vueTags } from './plugins/vueTags.ts';
import { vueUseTags } from './plugins/vueUseTags.ts';
import { vueRouterTags } from './plugins/vueRouterTags.ts';
import type { VAIC_Config } from '../types/config.interface.ts';

export default async function ({componentsFile, projectPath, html, svg, vue, vueUse, vueRouter, vuetify, customTags, quiet}: VAIC_Config): Promise<ComponentSearch> {
  const getUnknownTagsFromFile = async (fullPath: string): Promise<boolean> => {
    stats.fileCounter++;

    const fileContent = await fs.readFile(fullPath, 'utf8');

    const isTemplate = fileContent.includes('<template>');

    if (!isTemplate) {
      return true;
    }

    stats.templateFiles++;

    const unknownTagsOfFile: UnknownTagsOfFile[] = [];

    let script = false;
    let style = false;

    const linesOfFile = fileContent.split(/\n/);

    linesOfFile.forEach((line: string, index: number) => {
      if (line.match(/<script[\w\W]*/)) {
        script = true;
      }

      if (line.match(/<\/script>/)) {
        script = false;
      }

      if (line.match(/<style[\w\W]*/)) {
        style = true;
      }

      if (line.match(/<\/style>/)) {
        style = false;
      }

      if (script || style) {
        return false; // Skip lines within <script> or <style> blocks
      }

      const lineMatchesTag = line.match(/<([\w-]+)/);
      const possibleSelfClosingTag = line.match(/<([\S]+)>/);
      const possibleTypeInEventProperty = line.match(/[\w-]+:[ ]*[\w-]+<([\w-]+)>/);

      if (lineMatchesTag === null) {
        return false;
      }

      if (
        possibleTypeInEventProperty !== null && possibleTypeInEventProperty?.[1] === lineMatchesTag?.[1]
        || possibleSelfClosingTag !== null && possibleSelfClosingTag?.[1] !== lineMatchesTag?.[1]
      ) {
        return false;
      }

      const cleanedTag = lineMatchesTag?.[1].trim();
      const pureTag = cleanedTag.replace(/-/g, '').toLowerCase();

      const isTagInList = (tagList: string[], tag: string): boolean => {
        return tagList.some(tagFromListRaw => {
          const tagFromList = tagFromListRaw.replace(/-/, '').toLowerCase();
          return tagFromList === tag;
        })
      };

      const ignoredTags = [
        ...( html ? htmlTags as string[] : [] ),
        ...( svg ? svgTags : [] ),
        ...( vuetify ? vuetifyTags : [] ),
        ...( vue ? vueTags : [] ),
        ...( vueUse ? vueUseTags : [] ),
        ...( vueRouter ? vueRouterTags : [] ),
        ...( customTags.length >= 1 ? customTags : [] )
      ];

      if (ignoredTags.length >= 1) {
        const isTagIgnored = isTagInList(ignoredTags, pureTag);

        if (isTagIgnored) {
          return false;
        }
      }

      const componentTagList = componentsList.map(component => component.tag);

      if (componentTagList.includes(pureTag)) {
        return false;
      }

      unknownTagsOfFile.push({
        line: index + 1,
        tagName: cleanedTag,
        lines: [
          ...(linesOfFile[index - 1] ? [linesOfFile[index - 1]] : []),
          linesOfFile[index],
          ...(linesOfFile[index + 1] ? [linesOfFile[index + 1]] : [])]
      });
    });

    unknownTagsOfFile.forEach(({ tagName, line, lines }) => {
      unknownTags.push({ tagName: tagName, file: fullPath, line: line, lines });
    });

    return false;
  }

  const getUnknownTagsFromDirectory = async (directoryPath: string, indent = 0): Promise<void> => {
    stats.dirCounter++;

    const entries = await fs.readdir(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directoryPath, entry.name);

      if (entry.isFile()) {
        // Process file
        try {
          await getUnknownTagsFromFile(fullPath);
        } catch (error) {
          if (!quiet) {
            return Promise.reject({ errorText: `Error reading file ${directoryPath}: ${JSON.stringify(error)}` });
          }
        }
      } else if (entry.isDirectory()) {
        // Recursive call for subfolders
        try {
          await getUnknownTagsFromDirectory(fullPath, indent + 1);
        } catch (error) {
          if (!quiet) {
            return Promise.reject({ errorText: `Error reading path ${directoryPath}: ${JSON.stringify(error)}` });
          }
        }
      } else {
        // Symlinks, nothing to do here
      }
    }
  };

  const stats: Stats = {
    fileCounter: 0,
    dirCounter: 0,
    templateFiles: 0,
    startTime: Date.now(),
    endTime: Date.now()
  };

  const unknownTags: UnknownTags[] = [];

  const componentsList = await componentList(componentsFile);

  await getUnknownTagsFromDirectory(projectPath);

  stats.endTime = Date.now();

  return {
    stats,
    unknownTags,
    componentsList
  };
}
