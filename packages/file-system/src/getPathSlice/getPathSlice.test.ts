import { describe, it, expect } from 'vitest';
import { getPathSlice } from './getPathSlice';

describe('getPathSlice', () => {
  it('returns a slice of the path', () => {
    expect(getPathSlice('path/to/file', 0, 2)).toBe('path/to');
  });

  it('supports negative indexes', () => {
    expect(getPathSlice('path/to/file', -1)).toBe('file');
  });
});
