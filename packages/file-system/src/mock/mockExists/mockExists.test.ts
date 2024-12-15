import { describe, expect, it } from 'vitest';
import { documentA2, root } from '../../test-utils';
import { mockExists } from './mockExists';

describe('exists', () => {
  it('returns true if the file entry exists', () => {
    expect(mockExists(root, documentA2.path)).toBe(true);
  });

  it('returns false if the file entry exists', () => {
    expect(mockExists(root, 'foo')).toBe(false);
  });
});
