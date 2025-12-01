import path from 'node:path';
import url from 'node:url';
import { describe, expect, test } from 'vitest';
import { type VAIC_Config } from '../types/config.interface.ts';
import getUnknownTags from './getUnknownTags.ts';
import { getUniqueFromList } from './utils/index.ts';

const __filename = url.fileURLToPath(import.meta.url);
const basePath = path.dirname(__filename);

describe('vue-auto-import-checker', async () => {
  describe('no vuetify, no vueUse, no quasar & no customTags', async () => {
    const config: VAIC_Config = {
      componentsFile: path.join(basePath, '../tests/data/vue-test-project/components.d.ts'),
      projectPath: path.join(basePath, '../tests/data/vue-test-project/src'),
      userGeneratedPath: path.join(basePath, '../', 'node_modules/.cache'),
      customTags: [],
      customTagsFile: '',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      vuetify: false,
      vueUse: false,
      quasar: false,
      basePath: path.join(basePath, '../')
    };

    const result = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
    const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

    test('should return unknow tags in 14 lines with 19 unique tags in 4 files', () => {
      expect(result.unknownTags.length).to.equal(19);
      expect(uniqueTags.length).to.equal(14);
      expect(uniqueFiles.length).to.equal(4);
    });

    test('should return scanned 11 template files of 13 total files in 5 dirs', () => {
      expect(result.stats.dirCounter).to.equal(5);
      expect(result.stats.fileCounter).to.equal(13);
      expect(result.stats.templateFiles).to.equal(11);
    });
  });

  describe('vuetify true, but no vueUse, no quasar & no customTags', async () => {
    const config: VAIC_Config = {
      componentsFile: path.join(basePath, '../tests/data/vue-test-project/components.d.ts'),
      projectPath: path.join(basePath, '../tests/data/vue-test-project/src'),
      userGeneratedPath: path.join(basePath, '../', 'node_modules/.cache'),
      customTags: [],
      customTagsFile: '',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      vuetify: true,
      vueUse: false,
      quasar: false,
      basePath: path.join(basePath, '../')
    };

    const result = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
    const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

    test('should return unknow tags in 11 lines with 8 unique tags in 3 files', () => {
      expect(result.unknownTags.length).to.equal(11);
      expect(uniqueTags.length).to.equal(8);
      expect(uniqueFiles.length).to.equal(3);
    });
  });

  describe('vueUse true, but no vuetify, no quasar & no customTags', async () => {
    const config: VAIC_Config = {
      componentsFile: path.join(basePath, '../tests/data/vue-test-project/components.d.ts'),
      projectPath: path.join(basePath, '../tests/data/vue-test-project/src'),
      userGeneratedPath: path.join(basePath, '../', 'node_modules/.cache'),
      customTags: [],
      customTagsFile: '',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      vuetify: false,
      vueUse: true,
      quasar: false,
      basePath: path.join(basePath, '../')
    };

    const result = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
    const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

    test('should return unknow tags in 19 lines with 14 unique tags in 4 files', () => {
      expect(result.unknownTags.length).to.equal(19);
      expect(uniqueTags.length).to.equal(14);
      expect(uniqueFiles.length).to.equal(4);
    });
  });

  describe('quasar true, but no vuetify, no vueUse & no customTags', async () => {
    const config: VAIC_Config = {
      componentsFile: path.join(basePath, '../tests/data/vue-test-project/components.d.ts'),
      projectPath: path.join(basePath, '../tests/data/vue-test-project/src'),
      userGeneratedPath: path.join(basePath, '../', 'node_modules/.cache'),
      customTags: [],
      customTagsFile: '',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      vuetify: false,
      vueUse: false,
      quasar: true,
      basePath: path.join(basePath, '../')
    };

    const result = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
    const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

    test('should return unknow tags in 18 lines with 13 unique tags in 3 files', () => {
      expect(result.unknownTags.length).to.equal(18);
      expect(uniqueTags.length).to.equal(13);
      expect(uniqueFiles.length).to.equal(3);
    });
  });

  describe("customTags ['v-date-input'], but no vuetify, no vueUse & no quasar", async () => {
    const config: VAIC_Config = {
      componentsFile: path.join(basePath, '../tests/data/vue-test-project/components.d.ts'),
      projectPath: path.join(basePath, '../tests/data/vue-test-project/src'),
      userGeneratedPath: path.join(basePath, '../', 'node_modules/.cache'),
      customTags: ['v-date-input', 'v-icon'],
      customTagsFile: '',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      vuetify: false,
      vueUse: false,
      quasar: false,
      basePath: path.join(basePath, '../')
    };

    const result = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
    const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

    test('should return unknow tags in 15 lines with 12 unique tags in 4 files', () => {
      expect(result.unknownTags.length).to.equal(15);
      expect(uniqueTags.length).to.equal(12);
      expect(uniqueFiles.length).to.equal(4);
    });
  });

  describe("customTags ['v-date-input', 'v-icon'], but no vuetify, no vueUse & no quasar", async () => {
    const config: VAIC_Config = {
      componentsFile: path.join(basePath, '../tests/data/vue-test-project/components.d.ts'),
      projectPath: path.join(basePath, '../tests/data/vue-test-project/src'),
      userGeneratedPath: path.join(basePath, '../', 'node_modules/.cache'),
      customTags: ['v-date-input', 'v-icon'],
      customTagsFile: '',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      vuetify: false,
      vueUse: false,
      quasar: false,
      basePath: path.join(basePath, '../')
    };

    const result = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
    const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

    test('should return unknow tags in 15 lines with 12 unique tags in 4 files', () => {
      expect(result.unknownTags.length).to.equal(15);
      expect(uniqueTags.length).to.equal(12);
      expect(uniqueFiles.length).to.equal(4);
    });
  });

  describe("customTagsFile ['v-date-input', 'DocumentationIcon'] but no vuetify, no vueUse & no quasar", async () => {
    const config: VAIC_Config = {
      componentsFile: path.join(basePath, '../tests/data/vue-test-project/components.d.ts'),
      projectPath: path.join(basePath, '../tests/data/vue-test-project/src'),
      userGeneratedPath: path.join(basePath, '../', 'node_modules/.cache'),
      customTags: [],
      customTagsFile: './tests/data/customTagsFile.json',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      vuetify: false,
      vueUse: false,
      quasar: false,
      basePath: path.join(basePath, '../')
    };

    const result = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
    const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

    test('should return unknow tags in 16 lines with 12 unique tags in 4 files', () => {
      expect(result.unknownTags.length).to.equal(16);
      expect(uniqueTags.length).to.equal(12);
      expect(uniqueFiles.length).to.equal(4);
    });
  });

  describe("customTagsFile ['v-date-input', 'DocumentationIcon'], customTags ['SupportIcon'] vuetify true, vueUse true & quasar true", async () => {
    const config: VAIC_Config = {
      componentsFile: path.join(basePath, '../tests/data/vue-test-project/components.d.ts'),
      projectPath: path.join(basePath, '../tests/data/vue-test-project/src'),
      userGeneratedPath: path.join(basePath, '../', 'node_modules/.cache'),
      customTags: ['SupportIcon'],
      customTagsFile: './tests/data/customTagsFile.json',
      noHtml: false,
      noSvg: false,
      noVue: false,
      noVueRouter: false,
      vuetify: true,
      vueUse: true,
      quasar: true,
      basePath: path.join(basePath, '../')
    };

    const result = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.tagName));
    const uniqueFiles = getUniqueFromList(result.unknownTags.map((tag: UnknownTags) => tag.file));

    test('should return unknow tags in 6 lines with 4 unique tags in 2 files', () => {
      expect(result.unknownTags.length).to.equal(6);
      expect(uniqueTags.length).to.equal(4);
      expect(uniqueFiles.length).to.equal(2);
    });
  });
});
