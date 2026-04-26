import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { getTags } from "../index.js";
import { getUniqueFromList, statistics } from "./utils/index.js";
const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../');
const cachePath = 'node_modules/.cache';
describe('kafka', async () => {
    const config = {
        componentsFile: 'tests/data/vue-test-project-error/components.d.ts',
        projectPaths: [
            'tests/data/vue-test-project-error/src',
            'tests/data/vue-test-project-error/lib'
        ],
        tool: '',
        knownTags: [],
        knownTagsFile: '',
        negateKnown: [],
        knownFrameworks: [],
        cachePath,
        importsKnown: false,
        basePath,
        kafka: true,
        outputFormat: 'text'
    };
    statistics._stats = { ...statistics._initialState };
    const tagsList = await getTags(config);
    const uniqueTags = getUniqueFromList(tagsList.map((tag) => tag.tagName));
    const uniqueFiles = getUniqueFromList(tagsList.map((tag) => tag.file));
    const { lines, tags, files } = {
        lines: 97,
        tags: [
            'v-responsive',
            'v-app',
            'v-main',
            'div',
            'img',
            'HelloWorld',
            'nav',
            'RouterLink',
            'RouterView',
            'v-bottom-navigation',
            'v-btn',
            'v-icon',
            'span',
            'h1',
            'h3',
            'a',
            'WelcomeItem',
            'template',
            'DocumentationIcon',
            'ToolingIcon',
            'ToolingIcon0',
            'ToolingIcon1',
            'ToolingIcon2',
            'ToolingIcon3',
            'ToolingIcon4',
            'br',
            'code',
            'v-date-input',
            'EcosystemIcon',
            'CommunityIcon',
            'WelcomeItemDialog',
            'SupportIcon',
            'i',
            'slot',
            'svg',
            'path',
            'q-avatar',
            'p',
            'TheWelcome'
        ].sort(),
        files: 11
    };
    test(`should return tags in ${lines} lines`, () => {
        expect(tagsList).toHaveLength(lines);
    });
    test(`should return tags ${uniqueTags.sort().join(', ')}`, () => {
        expect(uniqueTags.sort()).toEqual(tags);
    });
    test(`should return ${tags.length} tags`, () => {
        expect(uniqueTags).toHaveLength(tags.length);
    });
    test(`should return tags in ${files} file`, () => {
        expect(uniqueFiles).toHaveLength(files);
    });
    const stats = statistics.getStats();
    test('should return scanned 6 dirs', () => {
        expect(stats.dirCounter).toEqual(6);
    });
    test('should return scanned 13 total files', () => {
        expect(stats.fileCounter).toEqual(13);
    });
    test('should return scanned 11 template files', () => {
        expect(stats.templateFiles).toEqual(11);
    });
});
