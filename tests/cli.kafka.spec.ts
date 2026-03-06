import { describe, expect, test } from 'vitest';
import { executeTest } from './utils/executeCliTest';

describe('npx vue-auto-import-checker -c', () => {
  test('-p ./tests/data/vue-test-project/src', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -p ./tests/data/vue-test-project/src -k -q'
    );
    expect(returnedData.success.trim()).toMatch(
      /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* unique tag[s]{0,1} in [0-9]* line[s]{0,1} in [0-9]* file[s]{0,1}/
    );
  });
});
