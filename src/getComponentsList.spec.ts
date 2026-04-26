import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { getComponentList } from '../index.ts';
import { statistics } from './utils/index.ts';

const __filename = fileURLToPath(import.meta.url);
const basePath = join(dirname(__filename), '../');

describe('tests/data/vue-test-project-error/components.d.ts', async () => {
  const cachePath = 'node_modules/.cache';

  const config: InternalConfig = {
    componentsFile: 'tests/data/vue-test-project-error/components.d.ts',
    projectPaths: [],
    tool: 'naiveui',
    knownTags: [],
    knownTagsFile: '',
    negateKnown: [],
    knownFrameworks: [],
    cachePath,
    importsKnown: false,
    basePath,
    kafka: true,
    outputFormat: 'text'
  };

  statistics._stats = { ...statistics._initialState };

  const componentList = await getComponentList(config);

  // Expected result
  const tags = [
    'HelloWorld',
    'IconCommunity',
    'IconDocumentation',
    'IconEcosystem',
    'IconSupport',
    'IconTooling',
    'TheWelcome',
    'WelcomeItem'
  ];

  test(`should return components ${tags.join(', ')}`, () => {
    expect(componentList).toEqual(tags);
  });

  test(`should return ${tags.length} components`, () => {
    expect(componentList).toHaveLength(tags.length);
  });
});
