import { describe, it, expect, beforeEach } from 'vitest';
import { mockRemoveFileEntry } from './mockRemoveFileEntry';
import { pageA1, createTestFsRoot } from '../../test-utils';
import { FileEntry } from '../../types';
import { mockExists } from '../mockExists';

describe('mockRemoveFileEntry', () => {
  let root: FileEntry;

  beforeEach(() => {
    root = createTestFsRoot();
  });

  it('throws if the file netry does not exist', () => {
    expect(async () =>
      mockRemoveFileEntry(root, `${root.path}/foo`),
    ).rejects.toThrow();
  });

  it('removes the file entry from the mock file system', () => {
    mockRemoveFileEntry(root, pageA1.path);

    expect(mockExists(root, pageA1.path)).toBe(false);
  });
});
