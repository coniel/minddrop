import { describe, beforeEach, it, expect } from 'vitest';
import { mockAddFileEntry } from './mockAddFileEntry';
import { FileEntry } from '../../types';
import { createTestFsRoot, pageA1, workspaceA } from '../../test-utils';
import { mockExists } from '../mockExists';

describe('mockAddFileEntry', () => {
  let root: FileEntry;

  beforeEach(() => {
    root = createTestFsRoot();
  });

  it('throws if the parent file entry does not exist', () => {
    expect(async () =>
      mockAddFileEntry(root, { path: 'foo/bar' }),
    ).rejects.toThrow();
  });

  it('throws if the file entry already exists', () => {
    expect(async () => mockAddFileEntry(root, pageA1)).rejects.toThrow();
  });

  it('adds the file entry', () => {
    const fileEntry: FileEntry = {
      path: `${workspaceA.path}/New file.md`,
      name: 'New file.md',
    };

    mockAddFileEntry(root, fileEntry);

    expect(mockExists(root, fileEntry.path)).toBe(true);
  });

  it('adds root entries to the root', () => {
    const fileEntry: FileEntry = {
      path: 'foo',
      name: 'foo',
    };

    mockAddFileEntry(root, fileEntry);

    expect(mockExists(root, 'foo')).toBe(true);
  });
});
