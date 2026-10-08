import { beforeEach, describe, expect, it } from 'vitest';
import { createTestFsRoot, documentA1, workspaceA } from '../../test-utils';
import { FsEntry } from '../../types';
import { mockAddFileEntry } from '../mockAddFileEntry';
import { mockExists } from '../mockExists';
import { mockRemoveDirEntry } from './mockRemoveDirEntry';

// Path of the empty directory added before each test
const emptyDirPath = `${workspaceA.path}/Empty`;

describe('mockRemoveDirEntry', () => {
  let root: FsEntry;

  beforeEach(() => {
    root = createTestFsRoot();

    mockAddFileEntry(
      root,
      { path: emptyDirPath, name: 'Empty', children: [] },
      {},
    );
  });

  it('removes an empty directory', () => {
    mockRemoveDirEntry(root, emptyDirPath, {});

    expect(mockExists(root, emptyDirPath, {})).toBe(false);
  });

  it('throws for a directory with contents unless recursive', () => {
    expect(() => mockRemoveDirEntry(root, workspaceA.path, {})).toThrow(
      'not empty',
    );
    expect(mockExists(root, documentA1.path, {})).toBe(true);
  });

  it('removes a directory with contents when recursive', () => {
    mockRemoveDirEntry(root, workspaceA.path, { recursive: true });

    expect(mockExists(root, workspaceA.path, {})).toBe(false);
  });

  it('removes a directory given in another case', () => {
    mockRemoveDirEntry(root, emptyDirPath.toUpperCase(), {});

    expect(mockExists(root, emptyDirPath, {})).toBe(false);
  });

  it('matches the case exactly when case-sensitive', () => {
    expect(() =>
      mockRemoveDirEntry(root, emptyDirPath.toUpperCase(), {
        caseSensitive: true,
      }),
    ).toThrow();
    expect(mockExists(root, emptyDirPath, { caseSensitive: true })).toBe(true);
  });

  it('throws if the directory does not exist', () => {
    expect(() =>
      mockRemoveDirEntry(root, `${workspaceA.path}/Missing`, {}),
    ).toThrow();
  });
});
