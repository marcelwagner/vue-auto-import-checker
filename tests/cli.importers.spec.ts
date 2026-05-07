import { describe, expect, test } from 'vitest';
import { executeTest } from './utils/executeCliTest.ts';
import { getFrameworkMatcher } from './utils/matcher.ts';

describe('npx vue-auto-import-checker -t', () => {
  test('nuxt -q', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -t nuxt -q'
    );
    expect(returnedData.success.trim()).toMatch(getFrameworkMatcher('nuxt'));
  });

  test('vuetify -q', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -t vuetify -q'
    );
    expect(returnedData.success.trim()).toMatch(getFrameworkMatcher('vuetify'));
  });

  test('vueuse -q', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -t vueuse -q'
    );
    expect(returnedData.success.trim()).toMatch(getFrameworkMatcher('vueuse'));
  });

  test('quasar -q', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -t quasar -q'
    );
    expect(returnedData.success.trim()).toMatch(getFrameworkMatcher('quasar'));
  });

  test('primevue -q', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -t primevue -q'
    );
    expect(returnedData.success.trim()).toMatch(
      getFrameworkMatcher('primevue')
    );
  });

  test('naiveui -q', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -t naiveui -q'
    );
    expect(returnedData.success.trim()).toMatch(getFrameworkMatcher('naiveui'));
  });
});
