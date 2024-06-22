import { describe, it, expect } from 'vitest';
import { mockGetFileEntry } from './mockGetFileEntry';
import { documentA1, root } from '../../test-utils';

describe('mockGetFileEntry', () => {
  it('throws if the file entry does not exist', () => {
    expect(async () =>
      mockGetFileEntry(root, `${root.path}/foo`),
    ).rejects.toThrow();
  });

  it('does something useful', () => {
    expect(mockGetFileEntry(root, documentA1.path)).toEqual(documentA1);
  });
});
