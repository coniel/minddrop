import { describe, beforeEach, it, expect } from 'vitest';
import { mockRenameFile } from './mockRenameFile';
import { FileEntry } from '../../types';
import {
  createTestFsRoot,
  documents,
  pageA1,
  workspaceA,
} from '../../test-utils';
import { mockExists } from '../mockExists';
import { mockGetFileEntry } from '../mockGetFileEntry';

const NEW_PATH = `${workspaceA.path}/New name.md`;

describe('mockRenameFile', () => {
  let root: FileEntry;

  beforeEach(() => {
    root = createTestFsRoot();
  });

  it('removes the original file entry', () => {
    mockRenameFile(root, pageA1.path, NEW_PATH);

    expect(mockExists(root, pageA1.path)).toBe(false);
  });

  it('adds the renamed file entry', () => {
    mockRenameFile(root, pageA1.path, NEW_PATH);

    expect(mockGetFileEntry(root, NEW_PATH)).toEqual({
      ...pageA1,
      path: NEW_PATH,
      name: 'New name.md',
    });
  });

  it('updates descendant paths if renamed file entry is a dir', () => {
    const newPath = `${documents.path}/Foo`;

    mockRenameFile(root, workspaceA.path, newPath);

    expect(mockExists(root, pageA1.path)).toBe(false);
    expect(mockExists(root, `${newPath}/${pageA1.name}`)).toBe(true);
  });
});
