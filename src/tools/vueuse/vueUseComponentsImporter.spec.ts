import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import { getUniqueFromList, statistics } from '../../utils/index.ts';
import { getUnknownTags } from '../../index.ts';
import { vueUseComponentsImporter } from './vueUseComponentsImporter.ts';

const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../../../');
const cachePath = 'node_modules/.cache';

vi.stubGlobal('logger', {
  debug: vi.fn(),
  info: vi.fn()
});

describe('tool vuuse-importer', () => {
  const tags = 44;

  test(`should return ${tags} vueUse tags`, async () => {
    const result = await vueUseComponentsImporter(basePath, cachePath);

    expect(result.length).to.equal(tags);
  });

  describe('produced', async () => {
    const vueUseConfig: InternalConfig = {
      componentsFile: 'tests/data/vue-test-project-error/components.d.ts',
      projectPaths: [
        'tests/data/vue-test-project-error/src',
        'tests/data/vue-test-project-error/lib'
      ],
      tool: '',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: ['vueuse'],
      cachePath,
      importsKnown: false,
      basePath,
      outputFormat: 'text'
    };

    const customFile = join(basePath, cachePath, 'vueUseTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    statistics._stats = { ...statistics._initialState };

    const vueUseResult = await getUnknownTags(vueUseConfig);
    const vueUseUniqueTags = getUniqueFromList(
      vueUseResult.map((tag: Tag) => tag.tagName)
    );
    const vueUseUniqueFiles = getUniqueFromList(
      vueUseResult.map((tag: Tag) => tag.file)
    );

    await vueUseComponentsImporter(basePath, cachePath);

    const customConfig: InternalConfig = {
      componentsFile: 'tests/data/vue-test-project-error/components.d.ts',
      projectPaths: [
        'tests/data/vue-test-project-error/src',
        'tests/data/vue-test-project-error/lib'
      ],
      tool: '',
      knownTags: [],
      knownTagsFile: join(cachePath, 'vueUseTags.json'),
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

    test('customVueUseFile should report same as vueUse flag', () => {
      expect(vueUseResult.length).to.equal(customResult.length);
      expect(vueUseUniqueTags.length).to.equal(customUniqueTags.length);
      expect(vueUseUniqueFiles.length).to.equal(customUniqueFiles.length);
    });
  });
});
