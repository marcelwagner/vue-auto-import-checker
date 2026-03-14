import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import { getUniqueFromList, default as getUnknownTags, type VAIC_Config } from '../../../index.ts';
import { nuxtComponentsImporter } from './nuxtComponentsImporter.ts';

const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../../../');
const cachePath = '.test-cache';

vi.stubGlobal('logger', {
  debug: vi.fn(),
  info: vi.fn()
});

describe('nuxt-importer tool', () => {
  const tags = 21;

  test(`should return ${tags} nuxt tags`, async () => {
    const result = await nuxtComponentsImporter(basePath, cachePath);

    expect(result.length).to.equal(tags);
  });

  describe('produced', async () => {
    const quasarConfig: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: ['nuxt'],
      cachePath,
      importsKnown: false,
      basePath
    };

    const customFile = join(basePath, cachePath, 'nuxtTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    const nuxtResult = await getUnknownTags(quasarConfig);

    const nuxtUniqueTags = getUniqueFromList(nuxtResult.tagsList.map((tag: Tag) => tag.tagName));
    const nuxtUniqueFiles = getUniqueFromList(nuxtResult.tagsList.map((tag: Tag) => tag.file));

    await nuxtComponentsImporter(basePath, cachePath);

    const customConfig: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: [],
      knownTagsFile: join(cachePath, 'nuxtTags.json'),
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

    test('customNuxtFile should report same as nuxt flag', () => {
      expect(nuxtResult.tagsList.length).to.equal(customResult.tagsList.length);
      expect(nuxtUniqueTags.length).to.equal(customUniqueTags.length);
      expect(nuxtUniqueFiles.length).to.equal(customUniqueFiles.length);
    });
  });
});
