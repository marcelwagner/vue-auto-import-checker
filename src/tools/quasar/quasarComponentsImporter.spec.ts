import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import { getUniqueFromList, default as getUnknownTags, type VAIC_Config } from '../../../index.ts';
import { quasarComponentsImporter } from '../index.ts';

const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../../../');
const cachePath = '.test-cache';

vi.stubGlobal('logger', {
  debug: vi.fn(),
  info: vi.fn()
});

describe('quasar-importer tool', () => {
  const tags = 79;

  test(`should return ${tags} quasar tags`, async () => {
    const result = await quasarComponentsImporter(basePath, cachePath);

    expect(result.length).to.equal(tags);
  });

  describe('produced', async () => {
    const quasarConfig: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPaths: ['tests/data/vue-test-project/src', 'tests/data/vue-test-project/lib'],
      knownTags: [],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: ['quasar'],
      cachePath,
      importsKnown: false,
      basePath
    };

    const customFile = join(basePath, cachePath, 'quasarTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    const quasarResult = await getUnknownTags(quasarConfig);

    const quasarUniqueTags = getUniqueFromList(
      quasarResult.tagsList.map((tag: Tag) => tag.tagName)
    );
    const quasarUniqueFiles = getUniqueFromList(quasarResult.tagsList.map((tag: Tag) => tag.file));

    await quasarComponentsImporter(basePath, cachePath);

    const customConfig: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPaths: ['tests/data/vue-test-project/src', 'tests/data/vue-test-project/lib'],
      knownTags: [],
      knownTagsFile: join(cachePath, 'quasarTags.json'),
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

    test('customQuasarFile should report same as quasar flag', () => {
      expect(quasarResult.tagsList.length).to.equal(customResult.tagsList.length);
      expect(quasarUniqueTags.length).to.equal(customUniqueTags.length);
      expect(quasarUniqueFiles.length).to.equal(customUniqueFiles.length);
    });
  });
});
