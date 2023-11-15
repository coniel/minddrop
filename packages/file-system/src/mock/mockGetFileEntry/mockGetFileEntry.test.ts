import { describe, it, expect } from 'vitest';
import { mockGetFileEntry } from './mockGetFileEntry';
import { pageA1, root } from '../../test-utils';

describe('mockGetFileEntry', () => {
  it('throws if the file entry does not exist', () => {
    expect(async () =>
      mockGetFileEntry(root, `${root.path}/foo`),
    ).rejects.toThrow();
  });

  it('does something useful', () => {
    expect(mockGetFileEntry(root, pageA1.path)).toEqual(pageA1);
  });
});
