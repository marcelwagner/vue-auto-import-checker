import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { default as nuxtTags } from '../plugins/nuxtTags.json';
import { default as quasarTags } from '../plugins/quasarTags.json';
import { default as vuetifyTags } from '../plugins/vuetifyTags.json';
import { default as vueUseTags } from '../plugins/vueUseTags.json';
import {
  nuxtComponentsImporter,
  quasarComponentsImporter,
  vuetifyComponentsImporter,
  vueUseComponentsImporter
} from '../tools/index';
import { getJsonFileContent } from './file';

export async function getFrameworkTags(frameworks: Frameworks[], userGeneratedPath: string) {
  const allLists = await Promise.all(
    frameworks.map(framework => {
      return new Promise(resolve => {
        const isFramework = frameworks.includes(findFrameworkByName(framework)?.name as Frameworks);
        resolve(
          isFramework
            ? getCustomTagList(
                framework,
                join(userGeneratedPath, `${findFrameworkByName(framework)?.file}${toolsFileExt}`)
              )
            : []
        );
      });
    })
  );

  return allLists.flat() as string[];
}

export function getFrameworkList(
  vuetify: boolean,
  vueUse: boolean,
  quasar: boolean,
  nuxt: boolean
) {
  return [
    ...((vuetify ? ['vuetify'] : []) as Frameworks[]),
    ...((vueUse ? ['vueUse'] : []) as Frameworks[]),
    ...((quasar ? ['quasar'] : []) as Frameworks[]),
    ...((nuxt ? ['nuxt'] : []) as Frameworks[])
  ];
}

/**
 * Load a custom JSON tag list provided by the user, falling back to a built-in plugin file.
 *
 * Behavior:
 * - Construct the expected path for a user-provided JSON file: <userGeneratedPath>/<file>.json
 * - If that file exists, read and return its parsed content.
 * - Otherwise, read and return the default file located at <basePath>/src/plugins/<file>.json
 *
 * @param framework -
 * @param file - basename of the JSON file
 * @returns array of strings from the chosen file
 */
export async function getCustomTagList(framework: Frameworks, file: string) {
  // Build the path to a potential user-provided JSON file, e.g. /path/to/user/<file>.json
  const localPluginFile = join(`${file}`);

  // Quick synchronous existence check to decide which file to load
  const localPluginFileExists = existsSync(localPluginFile);

  // If a user file exists, load and return it; otherwise return null
  return localPluginFileExists
    ? await getJsonFileContent(localPluginFile)
    : findFrameworkByName(framework)?.tags || [];
}

/**
 * Mapping from canonical tool keys to their importer functions.
 *
 * The importer functions are invoked by the CLI flow to produce tag lists or
 * perform tool-specific operations. Keys must match the values produced by
 * `getToolName`.
 */
export const frameworksTools: FrameworkToolItem[] = [
  {
    name: 'vuetify',
    file: 'vuetifyTags',
    toolName: 'vuetify-importer',
    tool: vuetifyComponentsImporter,
    tags: vuetifyTags
  },
  {
    name: 'vueUse',
    file: 'vueUseTags',
    toolName: 'vueuse-importer',
    tool: vueUseComponentsImporter,
    tags: vueUseTags
  },
  {
    name: 'quasar',
    file: 'quasarTags',
    toolName: 'quasar-importer',
    tool: quasarComponentsImporter,
    tags: quasarTags
  },
  {
    name: 'nuxt',
    file: 'nuxtTags',
    toolName: 'nuxt-importer',
    tool: nuxtComponentsImporter,
    tags: nuxtTags
  }
];

export function findFrameworkByName(name: string) {
  return frameworksTools.find(framework => framework.name === name);
}

export function findFrameworkByToolName(toolName: string) {
  return frameworksTools.find(framework => framework.toolName === toolName);
}

export const toolsFileExt = '.json';
