import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';
import { getUniqueFromList, default as getUnknownTags } from "../../../index.js";
import { naiveuiComponentsImporter } from "./naiveuiComponentsImporter.js";
const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../../../');
const cachePath = '.test-cache';
vi.stubGlobal('logger', {
    debug: vi.fn(),
    info: vi.fn()
});
describe('naiveui-importer tool', () => {
    test('should return 93 naiveui tags', async () => {
        const result = await naiveuiComponentsImporter(basePath, cachePath);
        expect(result.length).to.equal(93);
    });
    describe('produced', async () => {
        const quasarConfig = {
            componentsFile: 'tests/data/vue-test-project/components.d.ts',
            projectPath: 'tests/data/vue-test-project/src',
            knownTags: [],
            knownTagsFile: '',
            negateKnown: [],
            knownFrameworks: ['naiveui'],
            cachePath,
            importsKnown: false,
            basePath
        };
        const customFile = join(basePath, cachePath, 'naiveuiTags.json');
        if (existsSync(customFile)) {
            rmSync(customFile);
        }
        const naiveuiResult = await getUnknownTags(quasarConfig);
        const naiveuiUniqueTags = getUniqueFromList(naiveuiResult.tagsList.map((tag) => tag.tagName));
        const naiveuiUniqueFiles = getUniqueFromList(naiveuiResult.tagsList.map((tag) => tag.file));
        await naiveuiComponentsImporter(basePath, cachePath);
        const customConfig = {
            componentsFile: 'tests/data/vue-test-project/components.d.ts',
            projectPath: 'tests/data/vue-test-project/src',
            knownTags: [],
            knownTagsFile: join(cachePath, 'naiveuiTags.json'),
            negateKnown: [],
            knownFrameworks: [],
            cachePath,
            importsKnown: false,
            basePath
        };
        const customResult = await getUnknownTags(customConfig);
        const customUniqueTags = getUniqueFromList(customResult.tagsList.map((tag) => tag.tagName));
        const customUniqueFiles = getUniqueFromList(customResult.tagsList.map((tag) => tag.file));
        test('customnaiveuiFile should report same as naiveui flag', () => {
            expect(naiveuiResult.tagsList.length).to.equal(customResult.tagsList.length);
            expect(naiveuiUniqueTags.length).to.equal(customUniqueTags.length);
            expect(naiveuiUniqueFiles.length).to.equal(customUniqueFiles.length);
        });
    });
});
