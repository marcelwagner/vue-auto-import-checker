import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import type { VAIC_Config } from '../../types/config.interface';
import getUnknownTags from '../getUnknownTags';
import { getUniqueFromList } from '../utils';
import { vuetifyComponentsImporter } from './vuetifyComponentsImporter';

const __filename = fileURLToPath(import.meta.url);
const basePath = dirname(__filename);

vi.stubGlobal('logger', {
  debug: vi.fn()
});

describe('vuetify-importer tool', () => {
  test('should return 144 vuetify tags', async () => {
    const result = await vuetifyComponentsImporter(join(basePath, '../../'));

    expect(result.length).to.equal(144);
  });

  describe('produced', async () => {
    const vuetifyConfig: VAIC_Config = {
      componentsFile: join(basePath, '../../tests/data/vue-test-project/components.d.ts'),
      projectPath: join(basePath, '../../tests/data/vue-test-project/src'),
      userGeneratedPath: join(basePath, '../../node_modules/.cache'),
      customTags: [],
      customTagsFile: '',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      frameworks: ['vuetify'],
      basePath: join(basePath, '../../')
    };

    const customFile = join(basePath, '../../node_modules/.cache/vuetifyTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    const vuetifyResult = await getUnknownTags(vuetifyConfig);
    const vuetifyUniqueTags = getUniqueFromList(
      vuetifyResult.unknownTags.map((tag: UnknownTags) => tag.tagName)
    );
    const vuetifyUniqueFiles = getUniqueFromList(
      vuetifyResult.unknownTags.map((tag: UnknownTags) => tag.file)
    );

    await vuetifyComponentsImporter(join(basePath, '../../'));

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

    test('customVuetifyFile should report same as vuetify flag', () => {
      expect(vuetifyResult.unknownTags.length).to.equal(customResult.unknownTags.length);
      expect(vuetifyUniqueTags.length).to.equal(customUniqueTags.length);
      expect(vuetifyUniqueFiles.length).to.equal(customUniqueFiles.length);
    });
  });
});
