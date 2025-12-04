import { describe, expect, test, vi } from 'vitest';
import { getTagFromLine } from './tags';

vi.stubGlobal('logger', {
  debug: vi.fn()
});

describe('tagUtils.ts', () => {
  describe('getTagFromLine', () => {
    test('get "The" and "Welcome" from "<The><Welcome>Hello</Welcome></The>"', () => {
      expect(getTagFromLine('<The><Welcome>Hello</Welcome></The>')).to.eql(['The', 'Welcome']);
    });

    test('get "The" and "Welcome" from "<The><Welcome />Hello</The>"', () => {
      expect(getTagFromLine('<The><Welcome />Hello</The>')).to.eql(['The', 'Welcome']);
    });

    test('get "TheWelcome" from "<TheWelcome msg="You did it!" />"', () => {
      expect(getTagFromLine('<TheWelcome msg="You did it!" />')).to.eql(['TheWelcome']);
    });

    test('get "TheWelcome" from "<TheWelcome msg="You did it!""', () => {
      expect(getTagFromLine('<TheWelcome msg="You did it!"')).to.eql(['TheWelcome']);
    });

    test('get "TheWelcome" from "<TheWelcome />"', () => {
      expect(getTagFromLine('<TheWelcome />')).to.eql(['TheWelcome']);
    });

    test('get "TheWelcome" from "<TheWelcome></TheWelcome>"', () => {
      expect(getTagFromLine('<TheWelcome></TheWelcome>')).to.eql(['TheWelcome']);
    });

    test('get "TheWelcome" from "<TheWelcome"', () => {
      expect(getTagFromLine('<TheWelcome')).to.eql(['TheWelcome']);
    });

    test('get "TheWelcome" from "<TheWelcome href="https://x.com/vuejs" target="_blank" rel="noopener">@vuejs</TheWelcome>', () => {
      expect(
        getTagFromLine(
          '<TheWelcome href="https://x.com/vuejs" target="_blank" rel="noopener">@vuejs</TheWelcome>'
        )
      ).to.eql(['TheWelcome']);
    });

    test('get "TheWelcome" from "<TheWelcome href="javascript:void(0)" @click="(someVar: SomeType<ThisNot>) => openReadmeInEditor""', () => {
      expect(
        getTagFromLine(
          '<TheWelcome href="javascript:void(0)" @click="(someVar: SomeType<ThisNot>) => openReadmeInEditor"'
        )
      ).to.eql(['TheWelcome']);
    });

    test('get nothing from "</TheWelcome>"', () => {
      expect(getTagFromLine('</TheWelcome>')).to.eql([]);
    });

    test('get nothing from "< /TheWelcome>"', () => {
      expect(getTagFromLine('< /TheWelcome>')).to.eql([]);
    });

    test('get nothing from "@click="(someVar: SomeType<Type>) => openReadmeInEditor"', () => {
      expect(getTagFromLine('@click="(someVar: SomeType<Type>) => openReadmeInEditor"')).to.eql([]);
    });

    test('get nothing from "@click="(someVar: SomeType<Type<\'bar\'>>) => openReadmeInEditor"', () => {
      expect(
        getTagFromLine('@click="(someVar: SomeType<Type<\'bar\'>>) => openReadmeInEditor"')
      ).to.eql([]);
    });

    test('get nothing from "@click="(someVar: SomeType<Type<bar>>) => openReadmeInEditor"', () => {
      expect(
        getTagFromLine('@click="(someVar: SomeType<Type<bar>>) => openReadmeInEditor"')
      ).to.eql([]);
    });

    test('get nothing from "property="openReadmeInEditor as Type<OfType>"', () => {
      expect(getTagFromLine('property="openReadmeInEditor as Type<OfType>"')).to.eql([]);
    });

    test('get nothing from "property="openReadmeInEditor as Type<OfType<\'bar\'>>"', () => {
      expect(getTagFromLine('property="openReadmeInEditor as Type<OfType<\'bar\'>>"')).to.eql([]);
    });

    test('get nothing from "property="openReadmeInEditor as Type<OfType<bar>>"', () => {
      expect(getTagFromLine('property="openReadmeInEditor as Type<OfType<bar>>"')).to.eql([]);
    });

    test('get nothing from "<!-- text here <https://urlhere.com> hello-->"', () => {
      expect(getTagFromLine('<!-- text here <https://urlhere.com> hello-->')).to.eql([]);
    });
  });
});
