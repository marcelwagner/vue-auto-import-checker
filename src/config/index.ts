import { repoUrl } from '../../config.ts';
import { default as packageJson } from '../../package.json' with { type: 'json' };
import { getBaseTags } from './getBaseTags.ts';
import { getFrameworksTools } from './getFrameworksTools.ts';

const repoTreeUrl = `${repoUrl}/tree/${packageJson.version}`;

export const baseTags: BaseTags[] = getBaseTags(repoTreeUrl);
export const frameworksTools: FrameworkToolItem[] = getFrameworksTools(repoTreeUrl);

export * from '../../config.ts';
export * from './getBaseTags.ts';
export * from './getFrameworksTools.ts';
export * from './vue.ts';
export { packageJson, repoTreeUrl };
