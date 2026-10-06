import { describe, expect, it } from 'vitest';
import { resolveTextRunsOutsideCodeSpans } from './resolveTextRunsOutsideCodeSpans';

describe('resolveTextRunsOutsideCodeSpans', () => {
  it('splits the text either side of an inline code span', () => {
    expect(resolveTextRunsOutsideCodeSpans('Write `code` to link')).toEqual([
      'Write ',
      ' to link',
    ]);
  });

  it('closes an inline code span only on a backtick run of its own length', () => {
    expect(resolveTextRunsOutsideCodeSpans('``a ` b`` After')).toEqual([
      ' After',
    ]);
  });

  it('reads an unclosed backtick as text', () => {
    expect(resolveTextRunsOutsideCodeSpans('A ` before')).toEqual([
      'A ` before',
    ]);
  });

  it('leaves out empty runs', () => {
    expect(resolveTextRunsOutsideCodeSpans('`code`')).toEqual([]);
  });
});
