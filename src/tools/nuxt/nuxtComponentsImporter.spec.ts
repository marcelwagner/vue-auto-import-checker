import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import {
  getUniqueFromList,
  default as getUnknownTags,
  statistics,
  type VAIC_Config
} from '../../../index.ts';
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
      componentsFile: 'tests/data/vue-test-project-error/components.d.ts',
      projectPaths: [
        'tests/data/vue-test-project-error/src',
        'tests/data/vue-test-project-error/lib'
      ],
      tool: '',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: ['nuxt'],
      cachePath,
      importsKnown: false,
      basePath,
      outputFormat: 'text'
    };

    const customFile = join(basePath, cachePath, 'nuxtTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    statistics._stats = { ...statistics._initialState };

    const nuxtResult = await getUnknownTags(quasarConfig);

    const nuxtUniqueTags = getUniqueFromList(
      nuxtResult.map((tag: Tag) => tag.tagName)
    );
    const nuxtUniqueFiles = getUniqueFromList(
      nuxtResult.map((tag: Tag) => tag.file)
    );

    await nuxtComponentsImporter(basePath, cachePath);

    const customConfig: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project-error/components.d.ts',
      projectPaths: [
        'tests/data/vue-test-project-error/src',
        'tests/data/vue-test-project-error/lib'
      ],
      tool: '',
      knownTags: [],
      knownTagsFile: join(cachePath, 'nuxtTags.json'),
      negateKnown: [],
      knownFrameworks: [],
      cachePath,
      importsKnown: false,
      basePath,
      outputFormat: 'text'
    };

    statistics._stats = { ...statistics._initialState };

    const customResult = await getUnknownTags(customConfig);
    const customUniqueTags = getUniqueFromList(
      customResult.map((tag: Tag) => tag.tagName)
    );
    const customUniqueFiles = getUniqueFromList(
      customResult.map((tag: Tag) => tag.file)
    );

    test('customNuxtFile should report same as nuxt flag', () => {
      expect(nuxtResult.length).to.equal(customResult.length);
      expect(nuxtUniqueTags.length).to.equal(customUniqueTags.length);
      expect(nuxtUniqueFiles.length).to.equal(customUniqueFiles.length);
    });
  });
});
