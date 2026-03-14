import { existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { executeTest } from './utils/executeCliTest';

describe('npx vue-auto-import-checker -c ./tests/data/vue-test-project/components.d.ts -p ./tests/data/vue-test-project/src', () => {
  test('-q', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -c ./tests/data/vue-test-project/components.d.ts -p ./tests/data/vue-test-project/src -q'
    );
    expect(returnedData.error.trim()).toMatch(
      /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* unique unknown tag[s]{0,1} in [0-9]* line[s]{0,1} in [0-9]* file[s]{0,1}/
    );
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
      'npx vue-auto-import-checker -c ./tests/data/vue-test-project/components.d.ts -p ./tests/data/vue-test-project/src -f vuetify -q'
    );
    expect(returnedData.error.trim()).toMatch(
      /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* unique unknown tag[s]{0,1} in [0-9]* line[s]{0,1} in [0-9]* file[s]{0,1}/
    );
  });

  test('-c ./tests/data/vue-test-project/components.d.ts -p ./tests/data/vue-test-project/src -q', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -c ./tests/data/vue-test-project/components.d.ts -p ./tests/data/vue-test-project/src -q'
    );
    expect(returnedData.error.trim()).toMatch(
      /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* unique unknown tag[s]{0,1} in [0-9]* line[s]{0,1} in [0-9]* file[s]{0,1}/
    );
  });

  test('-c ./tests/data/vue-test-project/components.d.ts -p ./tests/data/vue-test-project/src -n html svg -q', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -c ./tests/data/vue-test-project/components.d.ts -p ./tests/data/vue-test-project/src -n html svg -q'
    );
    expect(returnedData.error.trim()).toMatch(
      /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* unique unknown tag[s]{0,1} in [0-9]* line[s]{0,1} in [0-9]* file[s]{0,1}/
    );
  });

  test('-c ./tests/data/vue-test-project/components.d.ts -p ./tests/data/vue-test-project/src -n HTML -f Vuetify -q', async () => {
    const returnedData = await executeTest(
      'npx vue-auto-import-checker -c ./tests/data/vue-test-project/components.d.ts -p ./tests/data/vue-test-project/src -n HTML -f Vuetify -q'
    );
    expect(returnedData.error.trim()).toMatch(
      /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* unique unknown tag[s]{0,1} in [0-9]* line[s]{0,1} in [0-9]* file[s]{0,1}/
    );
  });
});
