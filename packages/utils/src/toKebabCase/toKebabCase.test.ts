import { describe, expect, it } from 'vitest';
import { toKebabCase } from './toKebabCase';

describe('toKebabCase', () => {
  it('shoud convert camelCase to kebab-case', () => {
    expect(toKebabCase('someCamelCasedWords')).toBe('some-camel-cased-words');
  });

  it('shoud convert PascalCase to kebab-case', () => {
    expect(toKebabCase('SomePascalCasedWords')).toBe('some-pascal-cased-words');
  });
});
