import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import type { VAIC_Config } from '../../types/config.interface';
import getUnknownTags from '../getUnknownTags';
import { getUniqueFromList } from '../utils';
import { vueUseComponentsImporter } from './vueUseComponentsImporter';

const __filename = fileURLToPath(import.meta.url);
const basePath = dirname(__filename);

vi.stubGlobal('logger', {
  debug: vi.fn()
});

describe('tool vuuse-importer', () => {
  test('should return 45 vueUse tags', async () => {
    const result = await vueUseComponentsImporter(join(basePath, '../../'));

    expect(result.length).to.equal(45);
  });

  describe('produced', async () => {
    const vueUseConfig: VAIC_Config = {
      componentsFile: join(basePath, '../../tests/data/vue-test-project/components.d.ts'),
      projectPath: join(basePath, '../../tests/data/vue-test-project/src'),
      userGeneratedPath: join(basePath, '../../node_modules/.cache'),
      customTags: [],
      customTagsFile: '',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      frameworks: ['vueUse'],
      basePath: join(basePath, '../../')
    };

    const customFile = join(basePath, '../../node_modules/.cache/vueUseTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    const vueUseResult = await getUnknownTags(vueUseConfig);
    const vueUseUniqueTags = getUniqueFromList(
      vueUseResult.unknownTags.map((tag: UnknownTags) => tag.tagName)
    );
    const vueUseUniqueFiles = getUniqueFromList(
      vueUseResult.unknownTags.map((tag: UnknownTags) => tag.file)
    );

    await vueUseComponentsImporter(join(basePath, '../../'));

    const customConfig: VAIC_Config = {
      componentsFile: join(basePath, '../../tests/data/vue-test-project/components.d.ts'),
      projectPath: join(basePath, '../../tests/data/vue-test-project/src'),
      userGeneratedPath: join(basePath, '../../node_modules/.cache'),
      customTags: [],
      customTagsFile: customFile,
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      frameworks: [],
      basePath: join(basePath, '../../')
    };

    const customResult = await getUnknownTags(customConfig);
    const customUniqueTags = getUniqueFromList(
      customResult.unknownTags.map((tag: UnknownTags) => tag.tagName)
    );
    const customUniqueFiles = getUniqueFromList(
      customResult.unknownTags.map((tag: UnknownTags) => tag.file)
    );

    test('customVueUseFile should report same as vueUse flag', () => {
      expect(vueUseResult.unknownTags.length).to.equal(customResult.unknownTags.length);
      expect(vueUseUniqueTags.length).to.equal(customUniqueTags.length);
      expect(vueUseUniqueFiles.length).to.equal(customUniqueFiles.length);
    });
  });
});
