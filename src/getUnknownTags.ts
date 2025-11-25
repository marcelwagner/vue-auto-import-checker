import fs from 'node:fs';
import fsPromise from 'node:fs/promises';
import path from 'node:path';

import type { VAIC_Config } from '../types/config.interface.ts';
import { componentList } from './plugins/componentList.ts';
import { htmlTags } from './plugins/htmlTags.ts';
import { svgTags } from './plugins/svgTags.ts';
import { default as vueRouterTags } from './plugins/vueRouterTags.json';
import { default as vueTags } from './plugins/vueTags.json';

export default async function ({
  componentsFile,
  projectPath,
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
  const localVueUsePluginExists = fs.existsSync(
    path.join(basePath, './.plugincache/vueUseTags.json')
  );
  const localVuetifyPluginExists = fs.existsSync(
    path.join(basePath, './.plugincache/vuetifyTags.json')
  );

  let vueUseTags = [] as string[];
  let vuetifyTags = [] as string[];

  if (localVueUsePluginExists) {
    vueUseTags = JSON.parse(
      await fsPromise.readFile(path.join(basePath, './.plugincache/vueUseTags.json'), 'utf8')
    );
  } else {
    vueUseTags = JSON.parse(
      await fsPromise.readFile(path.join(basePath, './src/plugins/vueUseTags.json'), 'utf8')
    );
  }

  if (localVuetifyPluginExists) {
    vuetifyTags = JSON.parse(
      await fsPromise.readFile(path.join(basePath, './.plugincache/vuetifyTags.json'), 'utf8')
    );
  } else {
    vuetifyTags = JSON.parse(
      await fsPromise.readFile(path.join(basePath, './src/plugins/vuetifyTags.json'), 'utf8')
    );
  }

  const getUnknownTagsFromFile = async (fullPath: string) => {
    stats.fileCounter++;

    const fileContent = await fsPromise.readFile(fullPath, 'utf8');

    // Is it a template file?
    const isTemplate = fileContent.includes('<template>');

    if (!isTemplate) {
      return;
    }

    stats.templateFiles++;

    const unknownTagsOfFile: UnknownTagsOfFile[] = [];

    let script = false;
    let style = false;

    // Get lines of file
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
        return;
      }

      // No script or style section, must be a template section
      const startTag = line.match(/<([\w-]+)/);
      const completeTag = line.match(/<([\w]+[\W\w]+[\w]+)>/);
      const multipleTags = completeTag?.[1].includes('>') && completeTag?.[1].includes('<');
      const endTag = line.match(/<\/([\w-]+)>/);
      const eventProperty = line.match(/[\w-]+:[ ]*[\w-]+<([\w-]+)>/);

      // No matching tag found in line
      if (startTag === null) {
        return;
      }

      // Event property as tag or quirks tag found
      if (
        (completeTag !== null &&
          startTag?.[1] !== completeTag?.[1] &&
          !multipleTags &&
          endTag === null) ||
        (completeTag !== null &&
          startTag?.[1] === completeTag?.[1] &&
          startTag?.[1] === eventProperty?.[1])
      ) {
        return;
      }

      const cleanedTag = startTag?.[1].trim();
      const pureTag = cleanedTag.replace(/-/g, '').toLowerCase();

      const isTagInList = (tagList: string[], tag: string): boolean => {
        return tagList.some(tagFromListRaw => {
          const tagFromList = tagFromListRaw.replace(/-/g, '').toLowerCase();
          return tagFromList === tag;
        });
      };

      // Which tags to ignore
      const ignoredTags = [
        ...(!noHtml ? (htmlTags as string[]) : []),
        ...(!noSvg ? svgTags : []),
        ...(!noVue ? vueTags : []),
        ...(!noVueRouter ? vueRouterTags : []),
        ...(vuetify ? vuetifyTags : []),
        ...(vueUse ? vueUseTags : []),
        ...(customTags.length >= 1 ? customTags : [])
      ];

      // Is tag in ignore list?
      if (ignoredTags.length >= 1) {
        const isTagIgnored = isTagInList(ignoredTags, pureTag);

        if (isTagIgnored) {
          return;
        }
      }

      const componentTagList = componentsList.map(component => component.tag);

      // Is tag in component list?
      if (componentTagList.includes(pureTag)) {
        return;
      }

      // Tag is unknown!
      unknownTagsOfFile.push({
        line: index + 1,
        tagName: cleanedTag,
        lines: [
          ...(linesOfFile[index - 1] ? [{ text: linesOfFile[index - 1], index: index }] : []),
          { text: linesOfFile[index], index: index + 1 },
          ...(linesOfFile[index + 1] ? [{ text: linesOfFile[index + 1], index: index + 2 }] : [])
        ]
      });
    });

    // save tags of file for later
    unknownTagsOfFile.forEach(({ tagName, line, lines }) => {
      unknownTags.push({ tagName: tagName, file: fullPath, line: line, lines });
    });

    return;
  };

  const getUnknownTagsFromDirectory = async (directoryPath: string, indent = 0) => {
    stats.dirCounter++;

    const entries = await fsPromise.readdir(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directoryPath, entry.name);

      if (entry.isFile()) {
        // Process file
        try {
          await getUnknownTagsFromFile(fullPath);
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
          await getUnknownTagsFromDirectory(fullPath, indent + 1);
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

  const stats: Stats = {
    fileCounter: 0,
    dirCounter: 0,
    templateFiles: 0,
    startTime: Date.now(),
    endTime: Date.now()
  };

  const unknownTags: UnknownTags[] = [];

  const componentsList = await componentList(path.join(basePath, componentsFile));

  await getUnknownTagsFromDirectory(projectPath);

  stats.endTime = Date.now();

  return {
    stats,
    unknownTags,
    componentsList
  };
}
