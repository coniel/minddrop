import { describe, it, expect } from 'vitest';
import { isWrapped } from './isWrapped';

describe('isWrapped', () => {
  it('returns true when the document is wrapped', () => {
    // Check if a wrapped document is wrapped
    expect(isWrapped('path/to/Wrapped document/Wrapped document.md')).toBe(
      true,
    );
  });

  it('returns false when the document is not wrapped', () => {
    // Check if a non-wrapped document is wrapped
    expect(isWrapped('path/to/Document.md')).toBe(false);
  });
});
