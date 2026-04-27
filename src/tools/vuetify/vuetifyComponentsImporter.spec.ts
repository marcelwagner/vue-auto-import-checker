import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import { getUniqueFromList, statistics } from '../../utils/index.ts';
import { getUnknownTags } from '../../index.ts';
import { vuetifyComponentsImporter } from './vuetifyComponentsImporter.ts';

const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../../../');
const cachePath = 'node_modules/.cache';

vi.stubGlobal('logger', {
  debug: vi.fn(),
  info: vi.fn()
});

describe('vuetify-importer tool', () => {
  const tags = 177;

  test(`should return ${tags} vuetify tags`, async () => {
    const result = await vuetifyComponentsImporter(basePath, cachePath);

    expect(result.length).to.equal(tags);
  });

  describe('produced', async () => {
    const vuetifyConfig: InternalConfig = {
      componentsFile: 'tests/data/vue-test-project-error/components.d.ts',
      projectPaths: [
        'tests/data/vue-test-project-error/src',
        'tests/data/vue-test-project-error/lib'
      ],
      tool: '',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: ['vuetify'],
      cachePath,
      importsKnown: false,
      basePath,
      outputFormat: 'text'
    };

    const customFile = join(basePath, cachePath, 'vuetifyTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    statistics._stats = { ...statistics._initialState };

    const vuetifyResult = await getUnknownTags(vuetifyConfig);
    const vuetifyUniqueTags = getUniqueFromList(
      vuetifyResult.map((tag: Tag) => tag.tagName)
    );
    const vuetifyUniqueFiles = getUniqueFromList(
      vuetifyResult.map((tag: Tag) => tag.file)
    );

    await vuetifyComponentsImporter(basePath, cachePath);

    const customConfig: InternalConfig = {
      componentsFile: 'tests/data/vue-test-project-error/components.d.ts',
      projectPaths: [
        'tests/data/vue-test-project-error/src',
        'tests/data/vue-test-project-error/lib'
      ],
      tool: '',
      knownTags: [],
      knownTagsFile: join(cachePath, 'vuetifyTags.json'),
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

    test('customVuetifyFile should report same length of tags total as vuetify build in', () => {
      expect(vuetifyResult.length).to.equal(customResult.length);
    });

    test('customVuetifyFile should report same length of unique tags as vuetify build in', () => {
      expect(vuetifyUniqueTags.length).to.equal(customUniqueTags.length);
    });

    test('customVuetifyFile should report same length of unique files as vuetify build in', () => {
      expect(vuetifyUniqueFiles.length).to.equal(customUniqueFiles.length);
    });
  });
});
