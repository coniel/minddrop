import { describe, beforeEach, it, expect } from 'vitest';
import { mockRenameFile } from './mockRenameFile';
import { FsEntry } from '../../types';
import {
  createTestFsRoot,
  documents,
  documentA1,
  workspaceA,
} from '../../test-utils';
import { mockExists } from '../mockExists';
import { mockGetFileEntry } from '../mockGetFileEntry';

const NEW_PATH = `${workspaceA.path}/New name.md`;

describe('mockRenameFile', () => {
  let root: FsEntry;

  beforeEach(() => {
    root = createTestFsRoot();
  });

  it('removes the original file entry', () => {
    mockRenameFile(root, documentA1.path, NEW_PATH);

    expect(mockExists(root, documentA1.path)).toBe(false);
  });

  it('adds the renamed file entry', () => {
    mockRenameFile(root, documentA1.path, NEW_PATH);

    expect(mockGetFileEntry(root, NEW_PATH)).toEqual({
      ...documentA1,
      path: NEW_PATH,
      name: 'New name.md',
    });
  });

  it('updates descendant paths if renamed file entry is a dir', () => {
    const newPath = `${documents.path}/Foo`;

    mockRenameFile(root, workspaceA.path, newPath);

    expect(mockExists(root, documentA1.path)).toBe(false);
    expect(mockExists(root, `${newPath}/${documentA1.name}`)).toBe(true);
  });
});
