import { describe, expect, it } from 'vitest';
import { resolveFtsPrefixQuery } from './resolveFtsPrefixQuery';

describe('resolveFtsPrefixQuery', () => {
  it('quotes each word as a prefix', () => {
    expect(resolveFtsPrefixQuery('apple pie')).toBe('"apple"* "pie"*');
  });

  it('doubles quotes inside a word', () => {
    expect(resolveFtsPrefixQuery('say "hi"')).toBe('"say"* """hi"""*');
  });

  it('quotes FTS5 operators as literal words', () => {
    expect(resolveFtsPrefixQuery('cats AND NOT dogs')).toBe(
      '"cats"* "AND"* "NOT"* "dogs"*',
    );
  });

  it('ignores surrounding and repeated whitespace', () => {
    expect(resolveFtsPrefixQuery('  apple \n pie  ')).toBe('"apple"* "pie"*');
  });

  it('returns null for a query without words', () => {
    expect(resolveFtsPrefixQuery('   ')).toBeNull();
  });
});
