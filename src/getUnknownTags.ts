import fs from 'node:fs/promises';
import path from 'node:path';

import { componentList } from './plugins/componentList';
import { htmlTags } from './plugins/htmlTags';
import { vuetifyTags } from './plugins/vuetifyTags';

export default async function (componentsFile: string, directoryPath: string, quiet: boolean): Promise<ComponentSearch> {
  const getUnknownTagsFromFile = async (fullPath: string): Promise<boolean> => {
    try {
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

        const lineMatchesTag = line.match(/<[a-zA-Z0-9-]+([ \n>]{1})/);

        if (lineMatchesTag === null) {
          return false;
        }

        const cleanedTag = lineMatchesTag?.[0].trim().replace(/</g, '').replace(/>/g, '');
        const pureTag = cleanedTag.replace(/-/g, '').toLowerCase();

        const tagIsHtml = htmlTags.some(tag => tag === pureTag);

        if (tagIsHtml) {
          return false;
        }

        const tagIsVuetify = vuetifyTags.some(tag => tag === pureTag);

        if (tagIsVuetify) {
          return false;
        }

        const componentTagList = componentsList.map(component => component.tag);

        if (componentTagList.includes(pureTag)) {
          return false;
        }

        unknownTagsOfFile.push({
          line: index + 1,
          tagName: cleanedTag,
          lines: [linesOfFile[index - 1], linesOfFile[index], linesOfFile[index + 1]]
        });
      });

      unknownTagsOfFile.forEach(({ tagName, line, lines }) => {
        unknownTags.push({ tagName: tagName, file: fullPath, line: line, lines });
      });

      return false;
    } catch (error) {
      if (!quiet) {
        console.error({ errorText: `Error reading path ${directoryPath}: ${error}` });
      }
      return false;
    }
  }

  const getUnknownTagsFromDirectory = async (directoryPath: string, indent = 0): Promise<void> => {
    try {
      const entries = await fs.readdir(directoryPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(directoryPath, entry.name);

        if (entry.isFile()) {
          // Process file
          await getUnknownTagsFromFile(fullPath);
        } else if (entry.isDirectory()) {
          // Recursive call for subfolders
          await getUnknownTagsFromDirectory(fullPath, indent + 1);
        } else {
          // Symlinks, nothing to do here
        }
      }
    } catch (error) {
      if (!quiet) {
        console.error({ errorText: `Error reading path ${directoryPath}: ${error}` });
      }
    }
  };

  const stats: Stats = {
    fileCounter: 0,
    templateFiles: 0,
    startTime: Date.now(),
    endTime: Date.now()
  };

  const unknownTags: UnknownTags[] = [];

  const componentsList = await componentList(componentsFile);

  await getUnknownTagsFromDirectory(directoryPath);

  stats.endTime = Date.now();

  return {
    stats,
    unknownTags,
    componentsList
  };
}
