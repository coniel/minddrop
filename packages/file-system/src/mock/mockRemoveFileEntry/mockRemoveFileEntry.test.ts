import { beforeEach, describe, expect, it } from 'vitest';
import { createTestFsRoot, documentA1, workspaceA } from '../../test-utils';
import { FsEntry } from '../../types';
import { mockExists } from '../mockExists';
import { mockRemoveFileEntry } from './mockRemoveFileEntry';

describe('mockRemoveFileEntry', () => {
  let root: FsEntry;

  beforeEach(() => {
    root = createTestFsRoot();
  });

  it('throws if the parent directory does not exist', async () => {
    await expect(async () =>
      mockRemoveFileEntry(root, `${root.path}/foo`, {}),
    ).rejects.toThrow();
  });

  it('throws if the file entry does not exist in its directory', () => {
    expect(() =>
      mockRemoveFileEntry(root, `${workspaceA.path}/Missing.md`, {}),
    ).toThrow('does not exist');
  });

  it('removes the file entry given its path in another case', () => {
    mockRemoveFileEntry(root, documentA1.path.toUpperCase(), {});

    expect(mockExists(root, documentA1.path, {})).toBe(false);
  });

  it('removes the file entry from the mock file system', () => {
    mockRemoveFileEntry(root, documentA1.path, {});

    expect(mockExists(root, documentA1.path, {})).toBe(false);
  });
});
