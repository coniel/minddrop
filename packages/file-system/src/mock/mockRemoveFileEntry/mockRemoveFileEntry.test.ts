import { describe, it, expect, beforeEach } from 'vitest';
import { mockRemoveFileEntry } from './mockRemoveFileEntry';
import { documentA1, createTestFsRoot } from '../../test-utils';
import { FsEntry } from '../../types';
import { mockExists } from '../mockExists';

describe('mockRemoveFileEntry', () => {
  let root: FsEntry;

  beforeEach(() => {
    root = createTestFsRoot();
  });

  it('throws if the file netry does not exist', () => {
    expect(async () =>
      mockRemoveFileEntry(root, `${root.path}/foo`),
    ).rejects.toThrow();
  });

  it('removes the file entry from the mock file system', () => {
    mockRemoveFileEntry(root, documentA1.path);

    expect(mockExists(root, documentA1.path)).toBe(false);
  });
});
