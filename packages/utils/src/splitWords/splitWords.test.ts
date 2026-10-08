import { describe, expect, it } from 'vitest';
import { splitWords } from './splitWords';

describe('splitWords', () => {
  it('splits text on whitespace', () => {
    expect(splitWords('apple pie')).toEqual(['apple', 'pie']);
  });

  it('ignores surrounding and repeated whitespace', () => {
    expect(splitWords('  apple \n\t pie  ')).toEqual(['apple', 'pie']);
  });

  it('returns no words for blank text', () => {
    expect(splitWords('   ')).toEqual([]);
  });
});
