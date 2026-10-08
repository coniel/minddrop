import { beforeEach, describe, expect, it } from 'vitest';
import { createTestFsRoot, documentA1, workspaceA } from '../../test-utils';
import { FsEntry } from '../../types';
import { mockExists } from '../mockExists';
import { mockGetFileEntry } from '../mockGetFileEntry';
import { mockCopyFile } from './mockCopyFile';

const COPY_PATH = `${workspaceA.path}/Document 1 copy.md`;

describe('copyFile', () => {
  let root: FsEntry;

  beforeEach(() => {
    root = createTestFsRoot();
  });

  it('throws if file entry does not exist', async () => {
    await expect(async () =>
      mockCopyFile(root, 'foo', COPY_PATH, {}),
    ).rejects.toThrow();
  });

  it('copies the file to a new path', () => {
    mockCopyFile(root, documentA1.path, COPY_PATH, {});

    expect(mockExists(root, COPY_PATH, {})).toBe(true);
  });

  it('copies a file given in another case', () => {
    mockCopyFile(root, documentA1.path.toUpperCase(), COPY_PATH, {});

    expect(mockExists(root, COPY_PATH, {})).toBe(true);
  });

  it('names the copy after its path', () => {
    mockCopyFile(root, documentA1.path, COPY_PATH, {});

    expect(mockGetFileEntry(root, COPY_PATH, {}).name).toBe(
      'Document 1 copy.md',
    );
  });
});
