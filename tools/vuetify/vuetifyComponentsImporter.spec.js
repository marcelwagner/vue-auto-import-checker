import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import { getUniqueFromList, default as getUnknownTags } from "../../index.js";
import { vuetifyComponentsImporter } from "../index.js";
const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../../');
const cachePath = '.test-cache';
vi.stubGlobal('logger', {
    debug: vi.fn(),
    info: vi.fn()
});
describe('vuetify-importer tool', () => {
    test('should return 153 vuetify tags', async () => {
        const result = await vuetifyComponentsImporter(basePath, cachePath);
        expect(result.length).to.equal(153);
    });
    describe('produced', async () => {
        const vuetifyConfig = {
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
        const customFile = join(basePath, cachePath, 'vuetifyTags.json');
        if (existsSync(customFile)) {
            rmSync(customFile);
        }
        const vuetifyResult = await getUnknownTags(vuetifyConfig);
        const vuetifyUniqueTags = getUniqueFromList(vuetifyResult.tagsList.map((tag) => tag.tagName));
        const vuetifyUniqueFiles = getUniqueFromList(vuetifyResult.tagsList.map((tag) => tag.file));
        await vuetifyComponentsImporter(basePath, cachePath);
        const customConfig = {
            componentsFile: 'tests/data/vue-test-project/components.d.ts',
            projectPath: 'tests/data/vue-test-project/src',
            knownTags: [],
            knownTagsFile: join(cachePath, 'vueUseTags.json'),
            negateKnown: [],
            knownFrameworks: [],
            cachePath,
            importsKnown: false,
            basePath
        };
        const customResult = await getUnknownTags(customConfig);
        const customUniqueTags = getUniqueFromList(customResult.tagsList.map((tag) => tag.tagName));
        const customUniqueFiles = getUniqueFromList(customResult.tagsList.map((tag) => tag.file));
        test('customVuetifyFile should report same length of tags total as vuetify build in', () => {
            expect(vuetifyResult.tagsList.length).to.equal(customResult.tagsList.length);
        });
        test('customVuetifyFile should report same length of unique tags as vuetify build in', () => {
            expect(vuetifyUniqueTags.length).to.equal(customUniqueTags.length);
        });
        test('customVuetifyFile should report same length of unique files as vuetify build in', () => {
            expect(vuetifyUniqueFiles.length).to.equal(customUniqueFiles.length);
        });
    });
});
