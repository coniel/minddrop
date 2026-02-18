import { describe, expect, it } from 'vitest';
import { documentA1, root } from '../../test-utils';
import { mockGetFileEntry } from './mockGetFileEntry';

describe('mockGetFileEntry', () => {
  it('throws if the file entry does not exist', async () => {
    await expect(async () =>
      mockGetFileEntry(root, `${root.path}/foo`),
    ).rejects.toThrow();
  });

  it('does something useful', () => {
    expect(mockGetFileEntry(root, documentA1.path)).toEqual(documentA1);
  });
});
