import fs from 'node:fs/promises';
import path from 'node:path';

export async function componentList(
  componentsFilePath: string
): Promise<ComponentTag[]> {
  try {
    const componentsFile = path.join(componentsFilePath);
    const componentsFileContent = await fs.readFile(componentsFile, 'utf8');
    const componentsListRaw = componentsFileContent.match(
      /[\W]*export interface GlobalComponents \{\W[\w\W][^}]+\W  \}/m
    );

    const componentsList: { tag: string; rawTag: string }[] = [];

    if (componentsListRaw?.[0]) {
      componentsListRaw[0]
        .replace(/[\W]*export interface GlobalComponents \{\W/, '')
        .replace(/[\W]*\}/, '')
        .split(/\n/)
        .forEach(line => {
          const rawMatch = line.trim().replace(/: typeof import\('[a-zA-Z0-9-./'[\]()",]+/, '');
          componentsList.push({ tag: rawMatch.toLowerCase(), rawTag: rawMatch });
        });
    }

    return componentsList;
  } catch (error) {
    return Promise.reject({ errorText: `Error in getComponentList: ${error}` });
  }
}
