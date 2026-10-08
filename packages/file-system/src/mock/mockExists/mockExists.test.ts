import { describe, expect, it } from 'vitest';
import { documentA2, root } from '../../test-utils';
import { mockExists } from './mockExists';

describe('exists', () => {
  it('returns true if the file entry exists', () => {
    expect(mockExists(root, documentA2.path, {})).toBe(true);
  });

  it('returns false if the file entry exists', () => {
    expect(mockExists(root, 'foo', {})).toBe(false);
  });

  it('matches paths regardless of case', () => {
    expect(mockExists(root, documentA2.path.toUpperCase(), {})).toBe(true);
  });

  it('matches paths case-sensitively when case-sensitive', () => {
    expect(
      mockExists(root, documentA2.path.toUpperCase(), { caseSensitive: true }),
    ).toBe(false);
  });
});
