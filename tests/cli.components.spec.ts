import { describe, expect, test } from 'vitest';
import { executeTest } from './utils/executeCliTest';

describe('npx vue-auto-import-checker -c', () => {
  test('./tests/data/vue-test-project/components.d.ts -q', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -c ./tests/data/vue-test-project/components.d.ts -q'
    );
    expect(returnedData.success.trim()).toMatch(/Found [0-9]* component[s]{0,1}/);
  });
});
