import { describe, expect, it } from 'vitest';
import { resolveJoinedPageRange } from './resolveJoinedPageRange';

// The empty range rendered before any page
const none = { first: 1, last: 0 };

describe('resolveJoinedPageRange', () => {
  it('renders the pages to draw when none were rendered', () => {
    expect(
      resolveJoinedPageRange(
        none,
        { first: 1, last: 3 },
        { first: 1, last: 6 },
      ),
    ).toEqual({ first: 1, last: 3 });
  });

  it('keeps the rendered pages left behind within the keep range', () => {
    // Resolve a scroll down from pages 3 to 7 to pages 6 to 10
    expect(
      resolveJoinedPageRange(
        { first: 3, last: 7 },
        { first: 6, last: 10 },
        { first: 4, last: 12 },
      ),
    ).toEqual({ first: 4, last: 10 });
  });

  it('keeps the rendered pages left behind when scrolling up', () => {
    // Resolve a scroll up from pages 6 to 10 to pages 3 to 7
    expect(
      resolveJoinedPageRange(
        { first: 6, last: 10 },
        { first: 3, last: 7 },
        { first: 1, last: 9 },
      ),
    ).toEqual({ first: 3, last: 9 });
  });

  it('joins rendered pages which end right before the pages to draw', () => {
    expect(
      resolveJoinedPageRange(
        { first: 4, last: 5 },
        { first: 6, last: 8 },
        { first: 3, last: 11 },
      ),
    ).toEqual({ first: 4, last: 8 });
  });

  it('joins rendered pages which start right after the pages to draw', () => {
    expect(
      resolveJoinedPageRange(
        { first: 9, last: 10 },
        { first: 6, last: 8 },
        { first: 3, last: 11 },
      ),
    ).toEqual({ first: 6, last: 10 });
  });

  it('renders only the pages to draw after a jump away', () => {
    // Resolve a jump from pages 1 to 3 to pages 20 to 22
    expect(
      resolveJoinedPageRange(
        { first: 1, last: 3 },
        { first: 20, last: 22 },
        { first: 17, last: 25 },
      ),
    ).toEqual({ first: 20, last: 22 });
  });

  it('renders only the pages to draw when the kept pages do not adjoin them', () => {
    // Resolve pages 10 and 11 staying in the keep range, with pages 12
    // to 14 between them and the pages to draw.
    expect(
      resolveJoinedPageRange(
        { first: 8, last: 11 },
        { first: 15, last: 17 },
        { first: 10, last: 20 },
      ),
    ).toEqual({ first: 15, last: 17 });
  });
});
