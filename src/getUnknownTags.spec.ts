import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { type VAIC_Config } from '../types/config.interface';
import getUnknownTags from './getUnknownTags';
import {
  quasarComponentsImporter,
  vuetifyComponentsImporter,
  vueUseComponentsImporter
} from './tools';
import { getUniqueFromList } from './utils/index';

const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../');

describe('vue-auto-import-checker', async () => {
  describe('no vuetify, no vueUse, no quasar & no customTags', async () => {
    const config: VAIC_Config = {
      componentsFile: join(basePath, 'tests/data/vue-test-project/components.d.ts'),
      projectPath: join(basePath, 'tests/data/vue-test-project/src'),
      userGeneratedPath: join(basePath, 'node_modules/.cache'),
      customTags: [],
      customTagsFile: '',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      frameworks: [],
      basePath
    };

    const result = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
    const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

    test('should return unknow tags in 18 lines with 14 unique tags in 3 files', () => {
      expect(result.unknownTags.length).to.equal(18);
      expect(uniqueTags.length).to.equal(14);
      expect(uniqueFiles.length).to.equal(3);
    });

    test('should return scanned 11 template files of 13 total files in 5 dirs', () => {
      expect(result.stats.dirCounter).to.equal(5);
      expect(result.stats.fileCounter).to.equal(13);
      expect(result.stats.templateFiles).to.equal(11);
    });
  });

  describe('vuetify true (no custom file), but no vueUse, no quasar & no customTags', async () => {
    const config: VAIC_Config = {
      componentsFile: join(basePath, 'tests/data/vue-test-project/components.d.ts'),
      projectPath: join(basePath, 'tests/data/vue-test-project/src'),
      userGeneratedPath: join(basePath, 'node_modules/.cache'),
      customTags: [],
      customTagsFile: '',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      frameworks: ['vuetify'],
      basePath
    };

    const customFile = join(basePath, 'node_modules/.cache/vuetifyTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    const result = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
    const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

    test('should return unknow tags in 10 lines with 8 unique tags in 2 files', () => {
      expect(result.unknownTags.length).to.equal(10);
      expect(uniqueTags.length).to.equal(8);
      expect(uniqueFiles.length).to.equal(2);
    });
  });

  describe('vuetify true (with custom file), but no vueUse, no quasar & no customTags', async () => {
    const config: VAIC_Config = {
      componentsFile: join(basePath, 'tests/data/vue-test-project/components.d.ts'),
      projectPath: join(basePath, 'tests/data/vue-test-project/src'),
      userGeneratedPath: join(basePath, 'node_modules/.cache'),
      customTags: [],
      customTagsFile: '',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      frameworks: ['vuetify'],
      basePath
    };

    await vuetifyComponentsImporter(basePath);

    const result = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
    const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

    test('should return unknow tags in 10 lines with 8 unique tags in 2 files', () => {
      expect(result.unknownTags.length).to.equal(10);
      expect(uniqueTags.length).to.equal(8);
      expect(uniqueFiles.length).to.equal(2);
    });
  });

  describe('vueUse true (no custom file), but no vuetify, no quasar & no customTags', async () => {
    const config: VAIC_Config = {
      componentsFile: join(basePath, 'tests/data/vue-test-project/components.d.ts'),
      projectPath: join(basePath, 'tests/data/vue-test-project/src'),
      userGeneratedPath: join(basePath, 'node_modules/.cache'),
      customTags: [],
      customTagsFile: '',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      frameworks: ['vueUse'],
      basePath
    };

    const customFile = join(basePath, 'node_modules/.cache/vueUseTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    const result = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
    const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

    test('should return unknow tags in 18 lines with 14 unique tags in 3 files', () => {
      expect(result.unknownTags.length).to.equal(18);
      expect(uniqueTags.length).to.equal(14);
      expect(uniqueFiles.length).to.equal(3);
    });
  });

  describe('vueUse true (with custom file), but no vuetify, no quasar & no customTags', async () => {
    const config: VAIC_Config = {
      componentsFile: join(basePath, 'tests/data/vue-test-project/components.d.ts'),
      projectPath: join(basePath, 'tests/data/vue-test-project/src'),
      userGeneratedPath: join(basePath, 'node_modules/.cache'),
      customTags: [],
      customTagsFile: '',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      frameworks: ['vueUse'],
      basePath
    };

    await vueUseComponentsImporter(basePath);

    const result = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
    const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

    test('should return unknow tags in 18 lines with 14 unique tags in 3 files', () => {
      expect(result.unknownTags.length).to.equal(18);
      expect(uniqueTags.length).to.equal(14);
      expect(uniqueFiles.length).to.equal(3);
    });
  });

  describe('quasar true (no custom file), but no vuetify, no vueUse & no customTags', async () => {
    const config: VAIC_Config = {
      componentsFile: join(basePath, 'tests/data/vue-test-project/components.d.ts'),
      projectPath: join(basePath, 'tests/data/vue-test-project/src'),
      userGeneratedPath: join(basePath, 'node_modules/.cache'),
      customTags: [],
      customTagsFile: '',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      frameworks: ['quasar'],
      basePath
    };

    const customFile = join(basePath, 'node_modules/.cache/quasarTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    const result = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
    const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

    test('should return unknow tags in 17 lines with 13 unique tags in 2 files', () => {
      expect(result.unknownTags.length).to.equal(17);
      expect(uniqueTags.length).to.equal(13);
      expect(uniqueFiles.length).to.equal(2);
    });
  });

  describe('quasar true (with custom file), but no vuetify, no vueUse & no customTags', async () => {
    const config: VAIC_Config = {
      componentsFile: join(basePath, 'tests/data/vue-test-project/components.d.ts'),
      projectPath: join(basePath, 'tests/data/vue-test-project/src'),
      userGeneratedPath: join(basePath, 'node_modules/.cache'),
      customTags: [],
      customTagsFile: '',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      frameworks: ['quasar'],
      basePath
    };

    await quasarComponentsImporter(basePath);

    const result = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
    const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

    test('should return unknow tags in 17 lines with 13 unique tags in 2 files', () => {
      expect(result.unknownTags.length).to.equal(17);
      expect(uniqueTags.length).to.equal(13);
      expect(uniqueFiles.length).to.equal(2);
    });
  });

  describe("customTags ['v-date-input', 'v-icon'], but no vuetify, no vueUse & no quasar", async () => {
    const config: VAIC_Config = {
      componentsFile: join(basePath, 'tests/data/vue-test-project/components.d.ts'),
      projectPath: join(basePath, 'tests/data/vue-test-project/src'),
      userGeneratedPath: join(basePath, 'node_modules/.cache'),
      customTags: ['v-date-input', 'v-icon'],
      customTagsFile: '',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      frameworks: [],
      basePath
    };

    const result = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
    const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

    test('should return unknow tags in 14 lines with 12 unique tags in 3 files', () => {
      expect(result.unknownTags.length).to.equal(14);
      expect(uniqueTags.length).to.equal(12);
      expect(uniqueFiles.length).to.equal(3);
    });
  });

  describe("customTagsFile ['v-date-input', 'DocumentationIcon'] but no vuetify, no vueUse & no quasar", async () => {
    const config: VAIC_Config = {
      componentsFile: join(basePath, 'tests/data/vue-test-project/components.d.ts'),
      projectPath: join(basePath, 'tests/data/vue-test-project/src'),
      userGeneratedPath: join(basePath, 'node_modules/.cache'),
      customTags: [],
      customTagsFile: join(basePath, 'tests/data/customTagsFile.json'),
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      frameworks: [],
      basePath
    };

    const result = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
    const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

    test('should return unknow tags in 15 lines with 12 unique tags in 3 files', () => {
      expect(result.unknownTags.length).to.equal(15);
      expect(uniqueTags.length).to.equal(12);
      expect(uniqueFiles.length).to.equal(3);
    });
  });

  describe("customTagsFile ['v-date-input', 'DocumentationIcon'], customTags ['SupportIcon'] vuetify true, vueUse true & quasar true", async () => {
    const config: VAIC_Config = {
      componentsFile: join(basePath, 'tests/data/vue-test-project/components.d.ts'),
      projectPath: join(basePath, 'tests/data/vue-test-project/src'),
      userGeneratedPath: join(basePath, 'node_modules/.cache'),
      customTags: ['SupportIcon'],
      customTagsFile: join(basePath, 'tests/data/customTagsFile.json'),
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      frameworks: ['vuetify', 'vueUse', 'quasar'],
      basePath
    };

    const result = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
    const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

    test('should return unknow tags in 5 lines with 4 unique tags in 1 file', () => {
      expect(result.unknownTags.length).to.equal(5);
      expect(uniqueTags.length).to.equal(4);
      expect(uniqueFiles.length).to.equal(1);
    });
  });
});
