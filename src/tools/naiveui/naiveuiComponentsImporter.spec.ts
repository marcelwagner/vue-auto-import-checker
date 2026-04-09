import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import { getUniqueFromList, default as getUnknownTags, type VAIC_Config } from '../../../index.ts';
import { naiveuiComponentsImporter } from './naiveuiComponentsImporter.ts';

const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../../../');
const cachePath = '.test-cache';

vi.stubGlobal('logger', {
  debug: vi.fn(),
  info: vi.fn()
});

describe('naiveui-importer tool', () => {
  const tags = 93;

  test(`should return ${tags} naiveui tags`, async () => {
    const result = await naiveuiComponentsImporter(basePath, cachePath);

    expect(result.length).to.equal(tags);
  });

  describe('produced', async () => {
    const quasarConfig: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPaths: ['tests/data/vue-test-project/src', 'tests/data/vue-test-project/lib'],
      knownTags: [],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: ['naiveui'],
      cachePath,
      importsKnown: false,
      basePath
    };

    const customFile = join(basePath, cachePath, 'naiveuiTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    const naiveuiResult = await getUnknownTags(quasarConfig);

    const naiveuiUniqueTags = getUniqueFromList(
      naiveuiResult.tagsList.map((tag: Tag) => tag.tagName)
    );
    const naiveuiUniqueFiles = getUniqueFromList(
      naiveuiResult.tagsList.map((tag: Tag) => tag.file)
    );

    await naiveuiComponentsImporter(basePath, cachePath);

    const customConfig: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPaths: ['tests/data/vue-test-project/src', 'tests/data/vue-test-project/lib'],
      knownTags: [],
      knownTagsFile: join(cachePath, 'naiveuiTags.json'),
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

    test('customnaiveuiFile should report same as naiveui flag', () => {
      expect(naiveuiResult.tagsList.length).to.equal(customResult.tagsList.length);
      expect(naiveuiUniqueTags.length).to.equal(customUniqueTags.length);
      expect(naiveuiUniqueFiles.length).to.equal(customUniqueFiles.length);
    });
  });
});
