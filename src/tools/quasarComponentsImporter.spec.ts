import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import type { VAIC_Config } from '../../types/config.interface';
import getUnknownTags from '../getUnknownTags';
import { getUniqueFromList } from '../utils';
import { quasarComponentsImporter } from './quasarComponentsImporter';

const __filename = fileURLToPath(import.meta.url);
const basePath = dirname(__filename);

vi.stubGlobal('logger', {
  debug: vi.fn()
});

describe('quasar-importer tool', () => {
  test('should return 79 quasar tags', async () => {
    const result = await quasarComponentsImporter(join(basePath, '../../'));

    expect(result.length).to.equal(79);
  });

  describe('produced', async () => {
    const quasarConfig: VAIC_Config = {
      componentsFile: join(basePath, '../../tests/data/vue-test-project/components.d.ts'),
      projectPath: join(basePath, '../../tests/data/vue-test-project/src'),
      userGeneratedPath: join(basePath, '../../node_modules/.cache'),
      customTags: [],
      customTagsFile: '',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      frameworks: ['quasar'],
      basePath: join(basePath, '../../')
    };

    const customFile = join(basePath, '../../node_modules/.cache/quasarTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    const quasarResult = await getUnknownTags(quasarConfig);

    const quasarUniqueTags = getUniqueFromList(
      quasarResult.unknownTags.map((tag: UnknownTags) => tag.tagName)
    );
    const quasarUniqueFiles = getUniqueFromList(
      quasarResult.unknownTags.map((tag: UnknownTags) => tag.file)
    );

    await quasarComponentsImporter(join(basePath, '../../'));

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

    test('customQuasarFile should report same as quasar flag', () => {
      expect(quasarResult.unknownTags.length).to.equal(customResult.unknownTags.length);
      expect(quasarUniqueTags.length).to.equal(customUniqueTags.length);
      expect(quasarUniqueFiles.length).to.equal(customUniqueFiles.length);
    });
  });
});
