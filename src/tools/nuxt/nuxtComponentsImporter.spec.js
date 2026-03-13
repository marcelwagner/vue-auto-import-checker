import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import { getUniqueFromList, default as getUnknownTags } from "../../../index.js";
import { nuxtComponentsImporter } from "./nuxtComponentsImporter.js";
const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../../../');
const cachePath = '.test-cache';
vi.stubGlobal('logger', {
    debug: vi.fn(),
    info: vi.fn()
});
describe('nuxt-importer tool', () => {
    test('should return 20 nuxt tags', async () => {
        const result = await nuxtComponentsImporter(basePath, cachePath);
        expect(result.length).to.equal(21);
    });
    describe('produced', async () => {
        const quasarConfig = {
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
        const customFile = join(basePath, cachePath, 'nuxtTags.json');
        if (existsSync(customFile)) {
            rmSync(customFile);
        }
        const nuxtResult = await getUnknownTags(quasarConfig);
        const nuxtUniqueTags = getUniqueFromList(nuxtResult.tagsList.map((tag) => tag.tagName));
        const nuxtUniqueFiles = getUniqueFromList(nuxtResult.tagsList.map((tag) => tag.file));
        await nuxtComponentsImporter(basePath, cachePath);
        const customConfig = {
            componentsFile: 'tests/data/vue-test-project/components.d.ts',
            projectPath: 'tests/data/vue-test-project/src',
            knownTags: [],
            knownTagsFile: join(cachePath, 'nuxtTags.json'),
            negateKnown: [],
            knownFrameworks: [],
            cachePath,
            importsKnown: false,
            basePath
        };
        const customResult = await getUnknownTags(customConfig);
        const customUniqueTags = getUniqueFromList(customResult.tagsList.map((tag) => tag.tagName));
        const customUniqueFiles = getUniqueFromList(customResult.tagsList.map((tag) => tag.file));
        test('customNuxtFile should report same as nuxt flag', () => {
            expect(nuxtResult.tagsList.length).to.equal(customResult.tagsList.length);
            expect(nuxtUniqueTags.length).to.equal(customUniqueTags.length);
            expect(nuxtUniqueFiles.length).to.equal(customUniqueFiles.length);
        });
    });
});
