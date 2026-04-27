import { default as config } from '../../config.json' with { type: 'json' };
import { default as packageJson } from '../../package.json' with { type: 'json' };
import { getBaseTags } from './baseTags.ts';
import { getFrameworksTools } from './frameworksTools.ts';

const repoTreeUrl = `${config.repoUrl}/tree/${packageJson.version}`;

export const baseTags: BaseTags[] = getBaseTags(repoTreeUrl);
export const frameworksTools: FrameworkToolItem[] =
  getFrameworksTools(repoTreeUrl);

export * from './commanderOptions.ts';
export * from './baseTags.ts';
export * from './frameworksTools.ts';
export * from './userConfig.ts';
export * from './vue.ts';
export { packageJson, config, repoTreeUrl };
