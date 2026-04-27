import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import { getUniqueFromList, statistics } from '../../utils/index.ts';
import { getUnknownTags } from '../../index.ts';
import { primevueComponentsImporter } from './primevueComponentsImporter.ts';

const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../../../');
const cachePath = 'node_modules/.cache';

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
    const primevueConfig: InternalConfig = {
      componentsFile: 'tests/data/vue-test-project-error/components.d.ts',
      projectPaths: [
        'tests/data/vue-test-project-error/src',
        'tests/data/vue-test-project-error/lib'
      ],
      tool: '',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: ['primevue'],
      cachePath,
      importsKnown: false,
      basePath,
      outputFormat: 'text'
    };

    const customFile = join(basePath, cachePath, 'primevueTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    statistics._stats = { ...statistics._initialState };

    const primevueResult = await getUnknownTags(primevueConfig);
    const primevueUniqueTags = getUniqueFromList(
      primevueResult.map((tag: Tag) => tag.tagName)
    );
    const primevueUniqueFiles = getUniqueFromList(
      primevueResult.map((tag: Tag) => tag.file)
    );

    await primevueComponentsImporter(basePath, cachePath);

    const customConfig: InternalConfig = {
      componentsFile: 'tests/data/vue-test-project-error/components.d.ts',
      projectPaths: [
        'tests/data/vue-test-project-error/src',
        'tests/data/vue-test-project-error/lib'
      ],
      tool: '',
      knownTags: [],
      knownTagsFile: join(cachePath, 'primevueTags.json'),
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

    test('customprimevueFile should report same as primevue flag', () => {
      expect(primevueResult.length).to.equal(customResult.length);
      expect(primevueUniqueTags.length).to.equal(customUniqueTags.length);
      expect(primevueUniqueFiles.length).to.equal(customUniqueFiles.length);
    });
  });
});
