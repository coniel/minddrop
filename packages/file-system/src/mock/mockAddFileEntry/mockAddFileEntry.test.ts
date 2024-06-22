import { describe, beforeEach, it, expect } from 'vitest';
import { mockAddFileEntry } from './mockAddFileEntry';
import { FsEntry } from '../../types';
import { createTestFsRoot, documentA1, workspaceA } from '../../test-utils';
import { mockExists } from '../mockExists';

describe('mockAddFileEntry', () => {
  let root: FsEntry;

  beforeEach(() => {
    root = createTestFsRoot();
  });

  it('throws if the parent file entry does not exist', () => {
    expect(async () =>
      mockAddFileEntry(root, { path: 'foo/bar' }),
    ).rejects.toThrow();
  });

  it('throws if the file entry already exists', () => {
    expect(async () => mockAddFileEntry(root, documentA1)).rejects.toThrow();
  });

  it('adds the file entry', () => {
    const fileEntry: FsEntry = {
      path: `${workspaceA.path}/New file.md`,
      name: 'New file.md',
    };

    mockAddFileEntry(root, fileEntry);

    expect(mockExists(root, fileEntry.path)).toBe(true);
  });

  it('adds root entries to the root', () => {
    const fileEntry: FsEntry = {
      path: 'foo',
      name: 'foo',
    };

    mockAddFileEntry(root, fileEntry);

    expect(mockExists(root, 'foo')).toBe(true);
  });
});
