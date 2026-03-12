import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import { getUniqueFromList, default as getUnknownTags, type VAIC_Config } from '../../../index.ts';
import { vueUseComponentsImporter } from '../index.ts';

const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../../../');
const cachePath = '.test-cache';

vi.stubGlobal('logger', {
  debug: vi.fn(),
  info: vi.fn()
});

describe('tool vuuse-importer', () => {
  test('should return 44 vueUse tags', async () => {
    const result = await vueUseComponentsImporter(basePath, cachePath);

    expect(result.length).to.equal(44);
  });

  describe('produced', async () => {
    const vueUseConfig: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: ['vueuse'],
      cachePath,
      importsKnown: false,
      basePath
    };

    const customFile = join(basePath, cachePath, 'vueUseTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    const vueUseResult = await getUnknownTags(vueUseConfig);
    const vueUseUniqueTags = getUniqueFromList(
      vueUseResult.tagsList.map((tag: Tag) => tag.tagName)
    );
    const vueUseUniqueFiles = getUniqueFromList(vueUseResult.tagsList.map((tag: Tag) => tag.file));

    await vueUseComponentsImporter(basePath, cachePath);

    const customConfig: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: [],
      knownTagsFile: join(cachePath, 'vueUseTags.json'),
      negateKnown: [],
      knownFrameworks: [],
      cachePath,
      importsKnown: false,
      basePath
    };

    const customResult = await getUnknownTags(customConfig);
    const customUniqueTags = getUniqueFromList(
      customResult.tagsList.map((tag: Tag) => tag.tagName)
    );
    const customUniqueFiles = getUniqueFromList(customResult.tagsList.map((tag: Tag) => tag.file));

    test('customVueUseFile should report same as vueUse flag', () => {
      expect(vueUseResult.tagsList.length).to.equal(customResult.tagsList.length);
      expect(vueUseUniqueTags.length).to.equal(customUniqueTags.length);
      expect(vueUseUniqueFiles.length).to.equal(customUniqueFiles.length);
    });
  });
});
