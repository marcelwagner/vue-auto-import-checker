import { describe, expect, test } from 'vitest';
import { getTagFromLine } from './tagUtils.ts';

describe('tagUtils.ts', () => {
  describe('getTagFromLine', () => {
    test('get "The" and "Welcome" from "<The><Welcome>Hello</Welcome></The>"', () => {
      expect(getTagFromLine('<The><Welcome>Hello</Welcome></The>')).to.eql(['The', 'Welcome']);
    });
  });
});
