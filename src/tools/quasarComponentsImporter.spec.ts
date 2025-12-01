import path from 'node:path';
import url from 'node:url';
import { describe, expect, test } from 'vitest';
import { quasarComponentsImporter } from './quasarComponentsImporter.ts';

const __filename = url.fileURLToPath(import.meta.url);
const basePath = path.dirname(__filename);

describe('quasar-importer tool', () => {
  test('should return 79 quasar tags', async () => {
    const result = await quasarComponentsImporter(path.join(basePath, '../../'));

    expect(result.length).to.equal(79);
  });
});
