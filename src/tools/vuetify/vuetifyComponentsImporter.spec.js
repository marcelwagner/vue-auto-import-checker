import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import { getUniqueFromList, default as getUnknownTags, statistics } from "../../../index.js";
import { vuetifyComponentsImporter } from "../index.js";
const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../../../');
const cachePath = '.test-cache';
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
        const vuetifyConfig = {
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
        const vuetifyUniqueTags = getUniqueFromList(vuetifyResult.map((tag) => tag.tagName));
        const vuetifyUniqueFiles = getUniqueFromList(vuetifyResult.map((tag) => tag.file));
        await vuetifyComponentsImporter(basePath, cachePath);
        const customConfig = {
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
        const customUniqueTags = getUniqueFromList(customResult.map((tag) => tag.tagName));
        const customUniqueFiles = getUniqueFromList(customResult.map((tag) => tag.file));
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
