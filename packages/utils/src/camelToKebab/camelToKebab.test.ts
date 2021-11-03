import { camelToKebab } from './camelToKebab';

describe('camelToKebab', () => {
  it('shoud convert camelCase to kebab-case', () => {
    expect(camelToKebab('someCamelCasedWords')).toBe('some-camel-cased-words');
  });
});
