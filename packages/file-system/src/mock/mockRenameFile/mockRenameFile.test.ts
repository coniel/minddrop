import { beforeEach, describe, expect, it } from 'vitest';
import { fileNameFromPath } from '../../fileNameFromPath';
import {
  createTestFsRoot,
  documentA1,
  documents,
  workspaceA,
} from '../../test-utils';
import { FsEntry } from '../../types';
import { mockExists } from '../mockExists';
import { mockGetFileEntry } from '../mockGetFileEntry';
import { mockRenameFile } from './mockRenameFile';

const NEW_PATH = `${workspaceA.path}/New name.md`;

describe('mockRenameFile', () => {
  let root: FsEntry;

  beforeEach(() => {
    root = createTestFsRoot();
  });

  it('removes the original file entry', () => {
    mockRenameFile(root, documentA1.path, NEW_PATH, {});

    expect(mockExists(root, documentA1.path, {})).toBe(false);
  });

  it('adds the renamed file entry', () => {
    mockRenameFile(root, documentA1.path, NEW_PATH, {});

    expect(mockGetFileEntry(root, NEW_PATH, {})).toEqual({
      ...documentA1,
      path: NEW_PATH,
      name: 'New name.md',
    });
  });

  it('renames the file entry to a path differing only in case', () => {
    const newPath = `${workspaceA.path}/DOCUMENT 1.md`;

    mockRenameFile(root, documentA1.path, newPath, {});

    expect(mockGetFileEntry(root, documentA1.path, {})).toEqual({
      ...documentA1,
      path: newPath,
      name: fileNameFromPath(newPath),
    });
  });

  it('updates descendant paths of a dir given in another case', () => {
    const newPath = `${documents.path}/Foo`;

    mockRenameFile(root, workspaceA.path.toLowerCase(), newPath, {});

    expect(
      mockGetFileEntry(root, `${newPath}/${documentA1.name}`, {}).path,
    ).toBe(`${newPath}/${documentA1.name}`);
  });

  it('updates descendant paths if renamed file entry is a dir', () => {
    const newPath = `${documents.path}/Foo`;

    mockRenameFile(root, workspaceA.path, newPath, {});

    expect(mockExists(root, documentA1.path, {})).toBe(false);
    expect(mockExists(root, `${newPath}/${documentA1.name}`, {})).toBe(true);
  });
});
