import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import { getUniqueFromList, default as getUnknownTags, statistics } from "../../../index.js";
import { naiveuiComponentsImporter } from "./naiveuiComponentsImporter.js";
const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../../../');
const cachePath = '.test-cache';
vi.stubGlobal('logger', {
    debug: vi.fn(),
    info: vi.fn()
});
describe('naiveui-importer tool', () => {
    const tags = 93;
    test(`should return ${tags} naiveui tags`, async () => {
        const result = await naiveuiComponentsImporter(basePath, cachePath);
        expect(result.length).to.equal(tags);
    });
    describe('produced', async () => {
        const quasarConfig = {
            componentsFile: 'tests/data/vue-test-project-error/components.d.ts',
            projectPaths: [
                'tests/data/vue-test-project-error/src',
                'tests/data/vue-test-project-error/lib'
            ],
            tool: '',
            knownTags: [],
            knownTagsFile: '',
            negateKnown: [],
            knownFrameworks: ['naiveui'],
            cachePath,
            importsKnown: false,
            basePath,
            outputFormat: 'text'
        };
        const customFile = join(basePath, cachePath, 'naiveuiTags.json');
        if (existsSync(customFile)) {
            rmSync(customFile);
        }
        statistics._stats = { ...statistics._initialState };
        const naiveuiResult = await getUnknownTags(quasarConfig);
        const naiveuiUniqueTags = getUniqueFromList(naiveuiResult.map((tag) => tag.tagName));
        const naiveuiUniqueFiles = getUniqueFromList(naiveuiResult.map((tag) => tag.file));
        await naiveuiComponentsImporter(basePath, cachePath);
        const customConfig = {
            componentsFile: 'tests/data/vue-test-project-error/components.d.ts',
            projectPaths: [
                'tests/data/vue-test-project-error/src',
                'tests/data/vue-test-project-error/lib'
            ],
            tool: '',
            knownTags: [],
            knownTagsFile: join(cachePath, 'naiveuiTags.json'),
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
        test('customnaiveuiFile should report same as naiveui flag', () => {
            expect(naiveuiResult.length).to.equal(customResult.length);
            expect(naiveuiUniqueTags.length).to.equal(customUniqueTags.length);
            expect(naiveuiUniqueFiles.length).to.equal(customUniqueFiles.length);
        });
    });
});
