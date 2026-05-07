import { describe, expect, test } from 'vitest';
import { executeTest } from './utils/executeCliTest.ts';
import { unknownMatch } from './utils/matcher.ts';

describe('npx vue-auto-import-checker', () => {
  test('-x ./tests/data/vue-test-project-error/vuectl.config.json', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -x ./tests/data/vue-test-project-error/vuectl.config.json'
    );
    expect(returnedData.error.trim()).toMatch(unknownMatch);
  });
});
