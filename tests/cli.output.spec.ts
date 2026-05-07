import { describe, test, expect } from 'vitest';
import { executeTest } from './utils/executeCliTest.ts';
import { noUnknownMatch, noUnknownMatchMd } from './utils/matcher.ts';

describe('npx vue-auto-import-checker -c ./tests/data/vue-test-project-error/components.d.ts -p ./tests/data/vue-test-project-error/src -q -o text', () => {
  test('-c ./tests/data/vue-test-project-success/components.d.ts -p ./tests/data/vue-test-project-success/src -q -o text', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -c ./tests/data/vue-test-project-success/components.d.ts -p ./tests/data/vue-test-project-success/src -f Vuetify -q'
    );
    expect(returnedData.success.trim()).toMatch(noUnknownMatch);
  });

  test('-c ./tests/data/vue-test-project-error/components.d.ts -p ./tests/data/vue-test-project-error/src -r -s -o json', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -c ./tests/data/vue-test-project-error/components.d.ts -p ./tests/data/vue-test-project-error/src -r -s -o json'
    );

    const resultJson = JSON.parse(returnedData.success.trim());

    expect(resultJson.total).toBe(7);
    expect(resultJson.success).toBeFalsy();
    expect(resultJson.summary.lines).toBe(9);
    expect(resultJson.summary.uniqueTags).toBe(7);
    expect(resultJson.summary.filesContainingTags).toBe(2);
    expect(resultJson.stats.directories).toBe(3);
    expect(resultJson.stats.files).toBe(5);
    expect(resultJson.stats.templateFiles).toBe(3);
    expect(resultJson.stats.templateFiles).toBe(3);
    expect(resultJson.filesContainingTags.length).toBe(
      resultJson.summary.filesContainingTags
    );
    expect(resultJson.uniqueTags.length).toBe(resultJson.summary.uniqueTags);
    expect(resultJson.unknownTags.length).toBe(resultJson.summary.lines);
  });

  test('-c ./tests/data/vue-test-project-error/components.d.ts -p ./tests/data/vue-test-project-error/src -r -s -o md', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -c ./tests/data/vue-test-project-error/components.d.ts -p ./tests/data/vue-test-project-error/src -r -s -o md'
    );

    expect(returnedData.success.trim()).toMatch(noUnknownMatchMd);
  });
});
