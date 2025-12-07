import { describe, expect, test } from 'vitest';
import packageJson from '../package.json';
import { executeTest } from './utils/executeCliTest';

describe('npx vue-auto-import-checker', () => {
  test('-v', async () => {
    const returnedData = await executeTest('npx vue-auto-import-checker -v');
    expect(returnedData.trim()).toEqual(`${packageJson.version}`);
  });

  test('-t nuxt-importer -q', async () => {
    const returnedData = await executeTest('npx vue-auto-import-checker -t nuxt-importer -q');
    expect(returnedData.trim()).toMatch(
      /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* nuxt tag[s]{0,1}/
    );
  });

  test('-t vuetify-importer -q', async () => {
    const returnedData = await executeTest('npx vue-auto-import-checker -t vuetify-importer -q');
    expect(returnedData.trim()).toMatch(
      /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* vuetify tag[s]{0,1}/
    );
  });

  test('-t vueuse-importer -q', async () => {
    const returnedData = await executeTest('npx vue-auto-import-checker -t vueuse-importer -q');
    expect(returnedData.trim()).toMatch(
      /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* vueuse tag[s]{0,1}/
    );
  });

  test('-t quasar-importer -q', async () => {
    const returnedData = await executeTest('npx vue-auto-import-checker -t quasar-importer -q');
    expect(returnedData.trim()).toMatch(
      /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* quasar tag[s]{0,1}/
    );
  });

  test('-c ./tests/data/vue-test-project/components.d.ts -q', async () => {
    const returnedData: string = await executeTest(
      'npx vue-auto-import-checker -c ./tests/data/vue-test-project/components.d.ts -q'
    );
    expect(returnedData.trim()).toMatch(/Found [0-9]* component[s]{0,1}/);
  });

  test('-c ./tests/data/vue-test-project/components.d.ts -p ./tests/data/vue-test-project/src -q', async () => {
    const returnedData: string = await executeTest(
      'npx vue-auto-import-checker -c ./tests/data/vue-test-project/components.d.ts -p ./tests/data/vue-test-project/src -q'
    );
    expect(returnedData.trim()).toMatch(
      /[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}, [0-9]{1,2}:[0-9]{1,2}:[0-9]{1,2} (AM|PM): Found [0-9]* unique unknown tag[s]{0,1} in [0-9]* line[s]{0,1} in [0-9]* file[s]{0,1}/
    );
  });
});
