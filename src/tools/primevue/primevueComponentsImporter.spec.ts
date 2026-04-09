import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import { getUniqueFromList, default as getUnknownTags, type VAIC_Config } from '../../../index.ts';
import { primevueComponentsImporter } from '../index.ts';

const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../../../');
const cachePath = '.test-cache';

vi.stubGlobal('logger', {
  debug: vi.fn(),
  info: vi.fn()
});

describe('primevue-importer tool', () => {
  const tags = 166;

  test(`should return ${tags} primevue tags`, async () => {
    const result = await primevueComponentsImporter(basePath, cachePath);

    expect(result.length).to.equal(tags);
  });

  describe('produced', async () => {
    const primevueConfig: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPaths: ['tests/data/vue-test-project/src', 'tests/data/vue-test-project/lib'],
      knownTags: [],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: ['primevue'],
      cachePath,
      importsKnown: false,
      basePath
    };

    const customFile = join(basePath, cachePath, 'primevueTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    const primevueResult = await getUnknownTags(primevueConfig);
    const primevueUniqueTags = getUniqueFromList(
      primevueResult.tagsList.map((tag: Tag) => tag.tagName)
    );
    const primevueUniqueFiles = getUniqueFromList(
      primevueResult.tagsList.map((tag: Tag) => tag.file)
    );

    await primevueComponentsImporter(basePath, cachePath);

    const customConfig: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPaths: ['tests/data/vue-test-project/src', 'tests/data/vue-test-project/lib'],
      knownTags: [],
      knownTagsFile: join(cachePath, 'primevueTags.json'),
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

    test('customprimevueFile should report same as primevue flag', () => {
      expect(primevueResult.tagsList.length).to.equal(customResult.tagsList.length);
      expect(primevueUniqueTags.length).to.equal(customUniqueTags.length);
      expect(primevueUniqueFiles.length).to.equal(customUniqueFiles.length);
    });
  });
});
