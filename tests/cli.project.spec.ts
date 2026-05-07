import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { executeTest } from './utils/executeCliTest.ts';
import { noUnknownMatch, unknownMatch } from './utils/matcher.ts';

describe('npx vue-auto-import-checker -c ./tests/data/vue-test-project-error/components.d.ts -p ./tests/data/vue-test-project-error/src', () => {
  test('-q', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -c ./tests/data/vue-test-project-error/components.d.ts -p ./tests/data/vue-test-project-error/src -q'
    );
    expect(returnedData.error.trim()).toMatch(unknownMatch);
  });

  test('-f vuetify vueuse nuxt quasar primevue -q', async () => {
    const __filename = fileURLToPath(import.meta.url);
    const basePath = dirname(__filename);
    const userGeneratedPath = join(basePath, 'node_modules/.cache');

    const vuetifyCustomFile = join(userGeneratedPath, 'vuetifyTags.json');

    if (existsSync(vuetifyCustomFile)) {
      rmSync(vuetifyCustomFile);
    }

    const vueuseCustomFile = join(userGeneratedPath, 'vueuseTags.json');

    if (existsSync(vueuseCustomFile)) {
      rmSync(vueuseCustomFile);
    }

    const nuxtCustomFile = join(userGeneratedPath, 'nuxtTags.json');

    if (existsSync(nuxtCustomFile)) {
      rmSync(nuxtCustomFile);
    }

    const quasarCustomFile = join(userGeneratedPath, 'quasarTags.json');

    if (existsSync(quasarCustomFile)) {
      rmSync(quasarCustomFile);
    }

    const primevueCustomFile = join(userGeneratedPath, 'primevueTags.json');

    if (existsSync(primevueCustomFile)) {
      rmSync(primevueCustomFile);
    }

    const returnedData = await executeTest(
      'npx vue-auto-import-checker -c ./tests/data/vue-test-project-error/components.d.ts -p ./tests/data/vue-test-project-error/src -f vuetify -q'
    );
    expect(returnedData.error.trim()).toMatch(unknownMatch);
  });

  test('-c ./tests/data/vue-test-project-error/components.d.ts -p ./tests/data/vue-test-project-error/src -q', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -c ./tests/data/vue-test-project-error/components.d.ts -p ./tests/data/vue-test-project-error/src -q'
    );
    expect(returnedData.error.trim()).toMatch(unknownMatch);
  });

  test('-c ./tests/data/vue-test-project-success/components.d.ts -p ./tests/data/vue-test-project-success/src -q', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -c ./tests/data/vue-test-project-success/components.d.ts -p ./tests/data/vue-test-project-success/src -f Vuetify -q'
    );
    expect(returnedData.success.trim()).toMatch(noUnknownMatch);
  });

  test('-c ./tests/data/vue-test-project-error/components.d.ts -p ./tests/data/vue-test-project-error/src -n html svg -q', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -c ./tests/data/vue-test-project-error/components.d.ts -p ./tests/data/vue-test-project-error/src -n html svg -q'
    );
    expect(returnedData.error.trim()).toMatch(unknownMatch);
  });

  test('-c ./tests/data/vue-test-project-error/components.d.ts -p ./tests/data/vue-test-project-error/src -n HTML -f Vuetify -q', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -c ./tests/data/vue-test-project-error/components.d.ts -p ./tests/data/vue-test-project-error/src -n HTML -f Vuetify -q'
    );
    expect(returnedData.error.trim()).toMatch(unknownMatch);
  });
});
