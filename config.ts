import { getBaseTags } from './base/getBaseTags.ts';
import { default as packageJson } from './package.json' with { type: 'json' };
import { getFrameworksTools } from './tools/getFrameworksTools.ts';

export const repoUrl = 'https://github.com/marcelwagner/vue-auto-import-checker';
export const toolsFileExt = 'json';
export const defaultCachePath = './node_modules/.cache';

export const baseTags = getBaseTags(repoUrl, packageJson.version);
export const frameworksTools = getFrameworksTools(repoUrl, packageJson.version);
export * from './base/vue.ts';
export { packageJson };
