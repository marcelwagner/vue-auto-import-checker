import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import type { VAIC_Config } from '../../types/config.interface';
import getUnknownTags from '../getUnknownTags';
import { getUniqueFromList } from '../utils';
import { nuxtComponentsImporter } from './nuxtComponentsImporter';

const __filename = fileURLToPath(import.meta.url);
const basePath = dirname(__filename);

vi.stubGlobal('logger', {
  debug: vi.fn()
});

describe('nuxt-importer tool', () => {
  test('should return 20 nuxt tags', async () => {
    const result = await nuxtComponentsImporter(join(basePath, '../../'));

    expect(result.length).to.equal(20);
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
      frameworks: ['nuxt'],
      basePath: join(basePath, '../../')
    };

    const customFile = join(basePath, '../../node_modules/.cache/nuxtTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    const nuxtResult = await getUnknownTags(quasarConfig);

    const nuxtUniqueTags = getUniqueFromList(
      nuxtResult.unknownTags.map((tag: UnknownTags) => tag.tagName)
    );
    const nuxtUniqueFiles = getUniqueFromList(
      nuxtResult.unknownTags.map((tag: UnknownTags) => tag.file)
    );

    await nuxtComponentsImporter(join(basePath, '../../'));

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

    test('customNuxtFile should report same as nuxt flag', () => {
      expect(nuxtResult.unknownTags.length).to.equal(customResult.unknownTags.length);
      expect(nuxtUniqueTags.length).to.equal(customUniqueTags.length);
      expect(nuxtUniqueFiles.length).to.equal(customUniqueFiles.length);
    });
  });
});
