import path from 'node:path';
import url from 'node:url';
import { describe, expect, test } from 'vitest';
import { vuetifyComponentsImporter } from './vuetifyComponentsImporter.ts';

const __filename = url.fileURLToPath(import.meta.url);
const basePath = path.dirname(__filename);

describe('vuetify-importer tool', () => {
  test('should return 144 vuetify tags', async () => {
    const result = await vuetifyComponentsImporter(path.join(basePath, '../../'));

    expect(result.length).to.equal(144);
  });
});
