import path from 'node:path';
import url from 'node:url';
import { describe, expect, test } from 'vitest';
import checkForUnknownTags from '../index.ts';
import { getUniqueFromList } from '../src/utils/reportUtils';
import { type VAIC_Config } from '../types/config.interface.ts';

const __filename = url.fileURLToPath(import.meta.url);
const basePath = path.dirname(__filename);

describe('vue-auto-import-checker', async () => {
  const config: VAIC_Config = {
    componentsFile: path.join(basePath, 'data/vue-test-project/components.d.ts'),
    projectPath: path.join(basePath, 'data/vue-test-project/src'),
    userGeneratedPath: path.join(basePath, '../', 'node_modules/.cache'),
    customTags: ['v-date-input'],
    noHtml: false,
    noSvg: false,
    noVue: false,
    noVueRouter: false,
    vuetify: true,
    vueUse: true,
    basePath: path.join(basePath, '../')
  };

  const result = await checkForUnknownTags(config);
  const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
  const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

  test('should return unknow tags in 8 lines with 6 unique tags in 2 files', () => {
    expect(result.unknownTags.length).to.equal(8);
    expect(uniqueTags.length).to.equal(6);
    expect(uniqueFiles.length).to.equal(2);
  });

  test('should return scanned 11 template files of 13 total files in 5 dirs', () => {
    expect(result.stats.dirCounter).to.equal(5);
    expect(result.stats.fileCounter).to.equal(13);
    expect(result.stats.templateFiles).to.equal(11);
  });
});
