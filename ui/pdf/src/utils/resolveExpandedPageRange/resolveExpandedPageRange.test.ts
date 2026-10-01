import { describe, expect, it } from 'vitest';
import { resolveExpandedPageRange } from './resolveExpandedPageRange';

describe('resolveExpandedPageRange', () => {
  it('extends the range by the pages on either side', () => {
    expect(resolveExpandedPageRange({ first: 10, last: 11 }, 3, 20)).toEqual({
      first: 7,
      last: 14,
    });
  });

  it('stops at the ends of the document', () => {
    expect(resolveExpandedPageRange({ first: 2, last: 19 }, 3, 20)).toEqual({
      first: 1,
      last: 20,
    });
  });

  it('leaves an empty range empty', () => {
    const range = resolveExpandedPageRange({ first: 1, last: 0 }, 3, 20);

    expect(range.last).toBeLessThan(range.first);
  });
});
