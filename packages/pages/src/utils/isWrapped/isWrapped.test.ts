import { describe, it, expect } from 'vitest';
import { isWrapped } from './isWrapped';

describe('isWrapped', () => {
  it('returns true when the page is wrapped', () => {
    expect(isWrapped('path/to/Wrapped page/Wrapped page.md')).toBe(true);
  });

  it('returns false when the page is not wrapped', () => {
    expect(isWrapped('path/to/Page.md')).toBe(false);
  });
});
