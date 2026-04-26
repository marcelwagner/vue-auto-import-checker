import { describe, expect, test } from 'vitest';
import { default as packageJson } from '../package.json' with { type: 'json' };
import { executeTest } from './utils/executeCliTest.ts';

describe('npx vue-auto-import-checker', () => {
  test('-v', async () => {
    const returnedData = await executeTest('npx vue-auto-import-checker -v');
    expect(returnedData.success.trim()).toEqual(`${packageJson.version}`);
  });
});
