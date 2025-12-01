import path from 'node:path';
import url from 'node:url';
import { describe, expect, test } from 'vitest';
import { vueUseComponentsImporter } from './vueUseComponentsImporter.ts';

const __filename = url.fileURLToPath(import.meta.url);
const basePath = path.dirname(__filename);

describe('tool vuuse-importer', () => {
  test('should return 45 vueUse tags', async () => {
    const result = await vueUseComponentsImporter(path.join(basePath, '../../'));

    expect(result.length).to.equal(45);
  });
});
