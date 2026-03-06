import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import {
  nuxtComponentsImporter,
  quasarComponentsImporter,
  vuetifyComponentsImporter,
  vueUseComponentsImporter
} from '../tools/index.ts';
import type { VAIC_Config } from '../types/config.interface.ts';
import { getUnknownTags } from './getUnknownTags.ts';
import { getUniqueFromList } from './utils/index.ts';

const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../');

describe('getUnknownTags', async () => {
  const cachePath = 'node_modules/.cache';

  describe('no ignored frameworks', async () => {
    const config: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: [],
      cachePath,
      importsKnown: false,
      basePath
    };

    const { unknownTagsList, stats } = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.tagName));
    const uniqueFiles = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.file));

    // Expected result
    const { lines, tags, files } = {
      lines: 23,
      tags: [
        'v-responsive',
        'v-app',
        'v-main',
        'v-bottom-navigation',
        'v-btn',
        'v-icon',
        'DocumentationIcon',
        'ToolingIcon',
        'ToolingIcon1',
        'ToolingIcon2',
        'ToolingIcon3',
        'ToolingIcon4',
        'v-date-input',
        'EcosystemIcon',
        'CommunityIcon',
        'WelcomeItemDialog',
        'SupportIcon',
        'q-avatar'
      ].sort(),
      files: 4
    };

    test(`should return unknown tags in ${lines} lines`, () => {
      expect(unknownTagsList).toHaveLength(lines);
    });
    test(`should return unknown tags ${uniqueTags.sort().join(', ')}`, () => {
      expect(uniqueTags.sort()).toEqual(tags);
    });
    test(`should return ${tags.length} unknown tags`, () => {
      expect(uniqueTags).toHaveLength(tags.length);
    });
    test(`should return unknown tags in ${files} file`, () => {
      expect(uniqueFiles).toHaveLength(files);
    });

    test('should return scanned 5 dirs', () => {
      expect(stats.dirCounter).toEqual(5);
    });
    test('should return scanned 13 total files', () => {
      expect(stats.fileCounter).toEqual(13);
    });
    test('should return scanned 11 template files', () => {
      expect(stats.templateFiles).toEqual(11);
    });
  });

  describe('no ignored html', async () => {
    const config: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: ['html'],
      knownFrameworks: [],
      cachePath,
      importsKnown: false,
      basePath
    };

    const { unknownTagsList } = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.tagName));
    const uniqueFiles = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.file));

    // Expected result
    const { lines, tags, files } = {
      lines: 56,
      tags: [
        'div',
        'img',
        'nav',
        'span',
        'h1',
        'h3',
        'br',
        'i',
        'p',
        'code',
        'slot',
        'template',
        'v-responsive',
        'v-app',
        'v-main',
        'v-bottom-navigation',
        'v-btn',
        'v-icon',
        'v-date-input',
        'q-avatar',
        'DocumentationIcon',
        'ToolingIcon',
        'ToolingIcon1',
        'ToolingIcon2',
        'ToolingIcon3',
        'ToolingIcon4',
        'EcosystemIcon',
        'CommunityIcon',
        'WelcomeItemDialog',
        'SupportIcon'
      ].sort(),
      files: 7
    };

    test(`should return unknown tags in ${lines} lines`, () => {
      expect(unknownTagsList).toHaveLength(lines);
    });
    test(`should return unknown tags ${uniqueTags.sort().join(', ')}`, () => {
      expect(uniqueTags.sort()).toEqual(tags);
    });
    test(`should return ${tags.length} unknown tags`, () => {
      expect(uniqueTags).toHaveLength(tags.length);
    });
    test(`should return unknown tags in ${files} file`, () => {
      expect(uniqueFiles).toHaveLength(files);
    });
  });

  describe('no ignored svg', async () => {
    const config: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: ['svg'],
      knownFrameworks: [],
      cachePath,
      importsKnown: false,
      basePath
    };

    const { unknownTagsList } = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.tagName));
    const uniqueFiles = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.file));

    // Expected result
    const { lines, tags, files } = {
      lines: 28,
      tags: [
        'path',
        'v-responsive',
        'v-app',
        'v-main',
        'v-bottom-navigation',
        'v-btn',
        'v-icon',
        'v-date-input',
        'q-avatar',
        'DocumentationIcon',
        'ToolingIcon',
        'ToolingIcon1',
        'ToolingIcon2',
        'ToolingIcon3',
        'ToolingIcon4',
        'EcosystemIcon',
        'CommunityIcon',
        'WelcomeItemDialog',
        'SupportIcon'
      ].sort(),
      files: 8
    };

    test(`should return unknown tags in ${lines} lines`, () => {
      expect(unknownTagsList).toHaveLength(lines);
    });
    test(`should return unknown tags ${uniqueTags.sort().join(', ')}`, () => {
      expect(uniqueTags.sort()).toEqual(tags);
    });
    test(`should return ${tags.length} unknown tags`, () => {
      expect(uniqueTags).toHaveLength(tags.length);
    });
    test(`should return unknown tags in ${files} file`, () => {
      expect(uniqueFiles).toHaveLength(files);
    });
  });

  describe('no ignored vue', async () => {
    const config: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: ['vue'],
      knownFrameworks: [],
      cachePath,
      importsKnown: false,
      basePath
    };

    const { unknownTagsList } = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.tagName));
    const uniqueFiles = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.file));

    // Expected result
    const { lines, tags, files } = {
      lines: 23,
      tags: [
        'v-responsive',
        'v-app',
        'v-main',
        'v-bottom-navigation',
        'v-btn',
        'v-icon',
        'DocumentationIcon',
        'ToolingIcon',
        'ToolingIcon1',
        'ToolingIcon2',
        'ToolingIcon3',
        'ToolingIcon4',
        'v-date-input',
        'EcosystemIcon',
        'CommunityIcon',
        'WelcomeItemDialog',
        'SupportIcon',
        'q-avatar'
      ].sort(),
      files: 4
    };

    test(`should return unknown tags in ${lines} lines`, () => {
      expect(unknownTagsList).toHaveLength(lines);
    });
    test(`should return unknown tags ${uniqueTags.sort().join(', ')}`, () => {
      expect(uniqueTags.sort()).toEqual(tags);
    });
    test(`should return ${tags.length} unknown tags`, () => {
      expect(uniqueTags).toHaveLength(tags.length);
    });
    test(`should return unknown tags in ${files} file`, () => {
      expect(uniqueFiles).toHaveLength(files);
    });
  });

  describe('vuetify as ignored framework (no custom file)', async () => {
    const config: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: ['vuetify'],
      cachePath,
      importsKnown: false,
      basePath
    };

    const customFile = join(basePath, 'node_modules/.cache/vuetifyTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    const { unknownTagsList } = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.tagName));
    const uniqueFiles = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.file));

    // Expected result
    const { lines, tags, files } = {
      lines: 15,
      tags: [
        'DocumentationIcon',
        'ToolingIcon',
        'ToolingIcon1',
        'ToolingIcon2',
        'ToolingIcon3',
        'ToolingIcon4',
        'v-date-input',
        'EcosystemIcon',
        'CommunityIcon',
        'WelcomeItemDialog',
        'SupportIcon',
        'q-avatar'
      ].sort(),
      files: 3
    };

    test(`should return unknown tags in ${lines} lines`, () => {
      expect(unknownTagsList).toHaveLength(lines);
    });
    test(`should return unknown tags ${uniqueTags.sort().join(', ')}`, () => {
      expect(uniqueTags.sort()).toEqual(tags);
    });
    test(`should return ${tags.length} unknown tags`, () => {
      expect(uniqueTags).toHaveLength(tags.length);
    });
    test(`should return unknown tags in ${files} file`, () => {
      expect(uniqueFiles).toHaveLength(files);
    });
  });

  describe('vuetify as ignored framework (with custom file)', async () => {
    const config: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: ['vuetify'],
      cachePath,
      importsKnown: false,
      basePath
    };

    await vuetifyComponentsImporter(basePath, cachePath);

    const { unknownTagsList } = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.tagName));
    const uniqueFiles = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.file));

    // Expected result
    const { lines, tags, files } = {
      lines: 15,
      tags: [
        'DocumentationIcon',
        'ToolingIcon',
        'ToolingIcon1',
        'ToolingIcon2',
        'ToolingIcon3',
        'ToolingIcon4',
        'v-date-input',
        'EcosystemIcon',
        'CommunityIcon',
        'WelcomeItemDialog',
        'SupportIcon',
        'q-avatar'
      ].sort(),
      files: 3
    };

    test(`should return unknown tags in ${lines} lines`, () => {
      expect(unknownTagsList).toHaveLength(lines);
    });
    test(`should return unknown tags ${uniqueTags.sort().join(', ')}`, () => {
      expect(uniqueTags.sort()).toEqual(tags);
    });
    test(`should return ${tags.length} unknown tags`, () => {
      expect(uniqueTags).toHaveLength(tags.length);
    });
    test(`should return unknown tags in ${files} file`, () => {
      expect(uniqueFiles).toHaveLength(files);
    });
  });

  describe('vueUse as ignored framework (no custom file)', async () => {
    const config: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: ['vueuse'],
      cachePath,
      importsKnown: false,
      basePath
    };

    const customFile = join(basePath, 'node_modules/.cache/vueUseTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    const { unknownTagsList } = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.tagName));
    const uniqueFiles = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.file));

    // Expected result
    const { lines, tags, files } = {
      lines: 23,
      tags: [
        'v-responsive',
        'v-app',
        'v-main',
        'v-bottom-navigation',
        'v-btn',
        'v-icon',
        'DocumentationIcon',
        'ToolingIcon',
        'ToolingIcon1',
        'ToolingIcon2',
        'ToolingIcon3',
        'ToolingIcon4',
        'v-date-input',
        'EcosystemIcon',
        'CommunityIcon',
        'WelcomeItemDialog',
        'SupportIcon',
        'q-avatar'
      ].sort(),
      files: 4
    };

    test(`should return unknown tags in ${lines} lines`, () => {
      expect(unknownTagsList).toHaveLength(lines);
    });
    test(`should return unknown tags ${uniqueTags.sort().join(', ')}`, () => {
      expect(uniqueTags.sort()).toEqual(tags);
    });
    test(`should return ${tags.length} unknown tags`, () => {
      expect(uniqueTags).toHaveLength(tags.length);
    });
    test(`should return unknown tags in ${files} file`, () => {
      expect(uniqueFiles).toHaveLength(files);
    });
  });

  describe('vueUse as ignored framework (with custom file)', async () => {
    const config: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: ['vueuse'],
      cachePath,
      importsKnown: false,
      basePath
    };

    await vueUseComponentsImporter(basePath, cachePath);

    const { unknownTagsList } = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.tagName));
    const uniqueFiles = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.file));

    // Expected result
    const { lines, tags, files } = {
      lines: 23,
      tags: [
        'v-responsive',
        'v-app',
        'v-main',
        'v-bottom-navigation',
        'v-btn',
        'v-icon',
        'DocumentationIcon',
        'ToolingIcon',
        'ToolingIcon1',
        'ToolingIcon2',
        'ToolingIcon3',
        'ToolingIcon4',
        'v-date-input',
        'EcosystemIcon',
        'CommunityIcon',
        'WelcomeItemDialog',
        'SupportIcon',
        'q-avatar'
      ].sort(),
      files: 4
    };

    test(`should return unknown tags in ${lines} lines`, () => {
      expect(unknownTagsList).toHaveLength(lines);
    });
    test(`should return unknown tags ${uniqueTags.sort().join(', ')}`, () => {
      expect(uniqueTags.sort()).toEqual(tags);
    });
    test(`should return ${tags.length} unknown tags`, () => {
      expect(uniqueTags).toHaveLength(tags.length);
    });
    test(`should return unknown tags in ${files} file`, () => {
      expect(uniqueFiles).toHaveLength(files);
    });
  });

  describe('quasar as ignored framework (no custom file)', async () => {
    const config: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: ['quasar'],
      cachePath,
      importsKnown: false,
      basePath
    };

    const customFile = join(basePath, 'node_modules/.cache/quasarTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    const { unknownTagsList } = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.tagName));
    const uniqueFiles = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.file));

    // Expected result
    const { lines, tags, files } = {
      lines: 22,
      tags: [
        'v-responsive',
        'v-app',
        'v-main',
        'v-bottom-navigation',
        'v-btn',
        'v-icon',
        'DocumentationIcon',
        'ToolingIcon',
        'ToolingIcon1',
        'ToolingIcon2',
        'ToolingIcon3',
        'ToolingIcon4',
        'v-date-input',
        'EcosystemIcon',
        'CommunityIcon',
        'WelcomeItemDialog',
        'SupportIcon'
      ].sort(),
      files: 3
    };

    test(`should return unknown tags in ${lines} lines`, () => {
      expect(unknownTagsList).toHaveLength(lines);
    });
    test(`should return unknown tags ${uniqueTags.sort().join(', ')}`, () => {
      expect(uniqueTags.sort()).toEqual(tags);
    });
    test(`should return ${tags.length} unknown tags`, () => {
      expect(uniqueTags).toHaveLength(tags.length);
    });
    test(`should return unknown tags in ${files} file`, () => {
      expect(uniqueFiles).toHaveLength(files);
    });
  });

  describe('quasar as ignored framework (with custom file)', async () => {
    const config: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: ['quasar'],
      cachePath,
      importsKnown: false,
      basePath
    };

    await quasarComponentsImporter(basePath, cachePath);

    const { unknownTagsList } = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.tagName));
    const uniqueFiles = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.file));

    // Expected result
    const { lines, tags, files } = {
      lines: 22,
      tags: [
        'v-responsive',
        'v-app',
        'v-main',
        'v-bottom-navigation',
        'v-btn',
        'v-icon',
        'DocumentationIcon',
        'ToolingIcon',
        'ToolingIcon1',
        'ToolingIcon2',
        'ToolingIcon3',
        'ToolingIcon4',
        'v-date-input',
        'EcosystemIcon',
        'CommunityIcon',
        'WelcomeItemDialog',
        'SupportIcon'
      ].sort(),
      files: 3
    };

    test(`should return unknown tags in ${lines} lines`, () => {
      expect(unknownTagsList).toHaveLength(lines);
    });
    test(`should return unknown tags ${uniqueTags.sort().join(', ')}`, () => {
      expect(uniqueTags.sort()).toEqual(tags);
    });
    test(`should return ${tags.length} unknown tags`, () => {
      expect(uniqueTags).toHaveLength(tags.length);
    });
    test(`should return unknown tags in ${files} file`, () => {
      expect(uniqueFiles).toHaveLength(files);
    });
  });

  describe('nuxt as ignored framework (no custom file)', async () => {
    const config: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: ['nuxt'],
      cachePath,
      importsKnown: false,
      basePath
    };

    const customFile = join(basePath, 'node_modules/.cache/nuxtTags.json');

    if (existsSync(customFile)) {
      rmSync(customFile);
    }

    const { unknownTagsList } = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.tagName));
    const uniqueFiles = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.file));

    // Expected result
    const { lines, tags, files } = {
      lines: 23,
      tags: [
        'v-responsive',
        'v-app',
        'v-main',
        'v-bottom-navigation',
        'v-btn',
        'v-icon',
        'DocumentationIcon',
        'ToolingIcon',
        'ToolingIcon1',
        'ToolingIcon2',
        'ToolingIcon3',
        'ToolingIcon4',
        'v-date-input',
        'EcosystemIcon',
        'CommunityIcon',
        'WelcomeItemDialog',
        'SupportIcon',
        'q-avatar'
      ].sort(),
      files: 4
    };

    test(`should return unknown tags in ${lines} lines`, () => {
      expect(unknownTagsList).toHaveLength(lines);
    });
    test(`should return unknown tags ${uniqueTags.sort().join(', ')}`, () => {
      expect(uniqueTags.sort()).toEqual(tags);
    });
    test(`should return ${tags.length} unknown tags`, () => {
      expect(uniqueTags).toHaveLength(tags.length);
    });
    test(`should return unknown tags in ${files} file`, () => {
      expect(uniqueFiles).toHaveLength(files);
    });
  });

  describe('nuxt as ignored framework (with custom file)', async () => {
    const config: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: ['nuxt'],
      cachePath,
      importsKnown: false,
      basePath
    };

    await nuxtComponentsImporter(basePath, cachePath);

    const { unknownTagsList } = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.tagName));
    const uniqueFiles = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.file));

    // Expected result
    const { lines, tags, files } = {
      lines: 23,
      tags: [
        'v-responsive',
        'v-app',
        'v-main',
        'v-bottom-navigation',
        'v-btn',
        'v-icon',
        'DocumentationIcon',
        'ToolingIcon',
        'ToolingIcon1',
        'ToolingIcon2',
        'ToolingIcon3',
        'ToolingIcon4',
        'v-date-input',
        'EcosystemIcon',
        'CommunityIcon',
        'WelcomeItemDialog',
        'SupportIcon',
        'q-avatar'
      ].sort(),
      files: 4
    };

    test(`should return unknown tags in ${lines} lines`, () => {
      expect(unknownTagsList).toHaveLength(lines);
    });
    test(`should return unknown tags ${uniqueTags.sort().join(', ')}`, () => {
      expect(uniqueTags.sort()).toEqual(tags);
    });
    test(`should return ${tags.length} unknown tags`, () => {
      expect(uniqueTags).toHaveLength(tags.length);
    });
    test(`should return unknown tags in ${files} file`, () => {
      expect(uniqueFiles).toHaveLength(files);
    });
  });

  describe("ignore tags: 'v-date-input', 'v-icon'", async () => {
    const config: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: ['v-date-input', 'v-icon'],
      knownTagsFile: '',
      negateKnown: [],
      knownFrameworks: [],
      cachePath,
      importsKnown: false,
      basePath
    };

    const { unknownTagsList } = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.tagName));
    const uniqueFiles = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.file));

    // Expected result
    const { lines, tags, files } = {
      lines: 19,
      tags: [
        'v-responsive',
        'v-app',
        'v-main',
        'v-bottom-navigation',
        'v-btn',
        'DocumentationIcon',
        'ToolingIcon',
        'ToolingIcon1',
        'ToolingIcon2',
        'ToolingIcon3',
        'ToolingIcon4',
        'EcosystemIcon',
        'CommunityIcon',
        'WelcomeItemDialog',
        'SupportIcon',
        'q-avatar'
      ].sort(),
      files: 4
    };

    test(`should return unknown tags in ${lines} lines`, () => {
      expect(unknownTagsList).toHaveLength(lines);
    });
    test(`should return unknown tags ${uniqueTags.sort().join(', ')}`, () => {
      expect(uniqueTags.sort()).toEqual(tags);
    });
    test(`should return ${tags.length} unknown tags`, () => {
      expect(uniqueTags).toHaveLength(tags.length);
    });
    test(`should return unknown tags in ${files} file`, () => {
      expect(uniqueFiles).toHaveLength(files);
    });
  });

  describe('ignore tags from file tests/data/customTagsFile.json', async () => {
    const config: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: [],
      knownTagsFile: 'tests/data/customTagsFile.json',
      negateKnown: [],
      knownFrameworks: [],
      cachePath,
      importsKnown: false,
      basePath
    };

    const { unknownTagsList } = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.tagName));
    const uniqueFiles = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.file));

    // Expected result
    const { lines, tags, files } = {
      lines: 20,
      tags: [
        'v-responsive',
        'v-app',
        'v-main',
        'v-bottom-navigation',
        'v-btn',
        'v-icon',
        'ToolingIcon',
        'ToolingIcon1',
        'ToolingIcon2',
        'ToolingIcon3',
        'ToolingIcon4',
        'EcosystemIcon',
        'CommunityIcon',
        'WelcomeItemDialog',
        'SupportIcon',
        'q-avatar'
      ].sort(),
      files: 4
    };

    test(`should return unknown tags in ${lines} lines`, () => {
      expect(unknownTagsList).toHaveLength(lines);
    });
    test(`should return unknown tags ${uniqueTags.sort().join(', ')}`, () => {
      expect(uniqueTags.sort()).toEqual(tags);
    });
    test(`should return ${tags.length} unknown tags`, () => {
      expect(uniqueTags).toHaveLength(tags.length);
    });
    test(`should return unknown tags in ${files} file`, () => {
      expect(uniqueFiles).toHaveLength(files);
    });
  });

  describe("ignored tag 'SupportIcon', ignore tags file tests/data/customTagsFile.json and frameworks vuetify, vueUse, quasar & nuxt", async () => {
    const config: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: ['SupportIcon'],
      knownTagsFile: 'tests/data/customTagsFile.json',
      negateKnown: [],
      knownFrameworks: ['vuetify', 'vueuse', 'quasar', 'nuxt'],
      cachePath,
      importsKnown: false,
      basePath
    };

    const { unknownTagsList } = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.tagName));
    const uniqueFiles = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.file));

    // Expected result
    const { lines, tags, files } = {
      lines: 10,
      tags: [
        'ToolingIcon',
        'ToolingIcon1',
        'ToolingIcon2',
        'ToolingIcon3',
        'ToolingIcon4',
        'EcosystemIcon',
        'CommunityIcon',
        'WelcomeItemDialog'
      ].sort(),
      files: 2
    };

    test(`should return unknown tags in ${lines} lines`, () => {
      expect(unknownTagsList).toHaveLength(lines);
    });
    test(`should return unknown tags ${uniqueTags.sort().join(', ')}`, () => {
      expect(uniqueTags.sort()).toEqual(tags);
    });
    test(`should return ${tags.length} unknown tags`, () => {
      expect(uniqueTags).toHaveLength(tags.length);
    });
    test(`should return unknown tags in ${files} file`, () => {
      expect(uniqueFiles).toHaveLength(files);
    });
  });

  describe('ignored no tags html & svg', async () => {
    const config: VAIC_Config = {
      componentsFile: 'tests/data/vue-test-project/components.d.ts',
      projectPath: 'tests/data/vue-test-project/src',
      knownTags: [],
      knownTagsFile: '',
      negateKnown: ['html', 'svg'],
      knownFrameworks: [],
      cachePath,
      importsKnown: false,
      basePath
    };

    const { unknownTagsList } = await getUnknownTags(config);
    const uniqueTags = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.tagName));
    const uniqueFiles = getUniqueFromList(unknownTagsList.map((tag: Tag) => tag.file));

    // Expected result
    const { lines, tags, files } = {
      lines: 86,
      tags: [
        'ToolingIcon',
        'ToolingIcon1',
        'ToolingIcon2',
        'ToolingIcon3',
        'ToolingIcon4',
        'EcosystemIcon',
        'CommunityIcon',
        'WelcomeItemDialog',
        'SupportIcon',
        'DocumentationIcon',
        'a',
        'br',
        'code',
        'div',
        'h1',
        'h3',
        'i',
        'img',
        'nav',
        'p',
        'path',
        'slot',
        'span',
        'svg',
        'template',
        'q-avatar',
        'v-app',
        'v-bottom-navigation',
        'v-btn',
        'v-date-input',
        'v-icon',
        'v-main',
        'v-responsive'
      ].sort(),
      files: 11
    };

    test(`should return unknown tags in ${lines} lines`, () => {
      expect(unknownTagsList).toHaveLength(lines);
    });
    test(`should return unknown tags ${uniqueTags.sort().join(', ')}`, () => {
      expect(uniqueTags.sort()).toEqual(tags);
    });
    test(`should return ${tags.length} unknown tags`, () => {
      expect(uniqueTags).toHaveLength(tags.length);
    });
    test(`should return unknown tags in ${files} file`, () => {
      expect(uniqueFiles).toHaveLength(files);
    });
  });
});
