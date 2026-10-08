import { describe, expect, it } from 'vitest';
import { documentA1, root } from '../../test-utils';
import { mockGetFileEntry } from './mockGetFileEntry';

describe('mockGetFileEntry', () => {
  it('throws if the file entry does not exist', async () => {
    await expect(async () =>
      mockGetFileEntry(root, `${root.path}/foo`, {}),
    ).rejects.toThrow();
  });

  it('returns the matching file entry', () => {
    expect(mockGetFileEntry(root, documentA1.path, {})).toEqual(documentA1);
  });

  it('returns the file entry as stored given its path in another case', () => {
    expect(mockGetFileEntry(root, documentA1.path.toLowerCase(), {})).toEqual(
      documentA1,
    );
  });

  it('throws given a path in another case when case-sensitive', async () => {
    await expect(async () =>
      mockGetFileEntry(root, documentA1.path.toLowerCase(), {
        caseSensitive: true,
      }),
    ).rejects.toThrow();
  });
});
