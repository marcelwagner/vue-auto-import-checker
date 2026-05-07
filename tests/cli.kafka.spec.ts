import { describe, expect, test } from 'vitest';
import { executeTest } from './utils/executeCliTest.ts';
import { uniqueMatch } from './utils/matcher.ts';

describe('npx vue-auto-import-checker -c', () => {
  test('-p ./tests/data/vue-test-project-error/src -k -q', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -p ./tests/data/vue-test-project-error/src -k -q'
    );
    expect(returnedData.success.trim()).toMatch(uniqueMatch);
  });
});
