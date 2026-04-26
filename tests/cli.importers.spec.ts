import { describe, expect, test } from 'vitest';
import { executeTest } from './utils/executeCliTest.ts';

describe('npx vue-auto-import-checker -t', () => {
  test('nuxt -q', async () => {
    const returnedData = await executeTest('npx vue-auto-import-checker -t nuxt -q');
    expect(returnedData.success.trim()).toMatch(
      /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* nuxt tag[s]{0,1}/
    );
  });

  test('vuetify -q', async () => {
    const returnedData = await executeTest('npx vue-auto-import-checker -t vuetify -q');
    expect(returnedData.success.trim()).toMatch(
      /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* vuetify tag[s]{0,1}/
    );
  });

  test('vueuse -q', async () => {
    const returnedData = await executeTest('npx vue-auto-import-checker -t vueuse -q');
    expect(returnedData.success.trim()).toMatch(
      /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* vueuse tag[s]{0,1}/
    );
  });

  test('quasar -q', async () => {
    const returnedData = await executeTest('npx vue-auto-import-checker -t quasar -q');
    expect(returnedData.success.trim()).toMatch(
      /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* quasar tag[s]{0,1}/
    );
  });

  test('primevue -q', async () => {
    const returnedData = await executeTest('npx vue-auto-import-checker -t primevue -q');
    expect(returnedData.success.trim()).toMatch(
      /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* primevue tag[s]{0,1}/
    );
  });

  test('naiveui -q', async () => {
    const returnedData = await executeTest('npx vue-auto-import-checker -t naiveui -q');
    expect(returnedData.success.trim()).toMatch(
      /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* naiveui tag[s]{0,1}/
    );
  });
});
