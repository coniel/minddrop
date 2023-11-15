import { describe, it, expect } from 'vitest';
import { mockExists } from './mockExists';
import { pageA2, root } from '../../test-utils';

describe('exists', () => {
  it('returns true if the file entry exists', () => {
    expect(mockExists(root, pageA2.path)).toBe(true);
  });

  it('returns false if the file entry exists', () => {
    expect(mockExists(root, 'foo')).toBe(false);
  });
});
