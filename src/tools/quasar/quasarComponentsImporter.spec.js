import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import { getUniqueFromList, default as getUnknownTags } from "../../../index.js";
import { quasarComponentsImporter } from "../index.js";
const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../../../');
const cachePath = '.test-cache';
vi.stubGlobal('logger', {
    debug: vi.fn(),
    info: vi.fn()
});
describe('quasar-importer tool', () => {
    const tags = 79;
    test(`should return ${tags} quasar tags`, async () => {
        const result = await quasarComponentsImporter(basePath, cachePath);
        expect(result.length).to.equal(tags);
    });
    describe('produced', async () => {
        const quasarConfig = {
            componentsFile: 'tests/data/vue-test-project/components.d.ts',
            projectPaths: ['tests/data/vue-test-project/src', 'tests/data/vue-test-project/lib'],
            knownTags: [],
            knownTagsFile: '',
            negateKnown: [],
            knownFrameworks: ['quasar'],
            cachePath,
            importsKnown: false,
            basePath
        };
        const customFile = join(basePath, cachePath, 'quasarTags.json');
        if (existsSync(customFile)) {
            rmSync(customFile);
        }
        const quasarResult = await getUnknownTags(quasarConfig);
        const quasarUniqueTags = getUniqueFromList(quasarResult.tagsList.map((tag) => tag.tagName));
        const quasarUniqueFiles = getUniqueFromList(quasarResult.tagsList.map((tag) => tag.file));
        await quasarComponentsImporter(basePath, cachePath);
        const customConfig = {
            componentsFile: 'tests/data/vue-test-project/components.d.ts',
            projectPaths: ['tests/data/vue-test-project/src', 'tests/data/vue-test-project/lib'],
            knownTags: [],
            knownTagsFile: join(cachePath, 'quasarTags.json'),
            negateKnown: [],
            knownFrameworks: [],
            cachePath,
            importsKnown: false,
            basePath
        };
        const customResult = await getUnknownTags(customConfig);
        const customUniqueTags = getUniqueFromList(customResult.tagsList.map((tag) => tag.tagName));
        const customUniqueFiles = getUniqueFromList(customResult.tagsList.map((tag) => tag.file));
        test('customQuasarFile should report same as quasar flag', () => {
            expect(quasarResult.tagsList.length).to.equal(customResult.tagsList.length);
            expect(quasarUniqueTags.length).to.equal(customUniqueTags.length);
            expect(quasarUniqueFiles.length).to.equal(customUniqueFiles.length);
        });
    });
});
