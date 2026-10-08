import { beforeEach, describe, expect, it } from 'vitest';
import { createTestFsRoot, documentA1, workspaceA } from '../../test-utils';
import { FsEntry } from '../../types';
import { mockExists } from '../mockExists';
import { mockGetFileEntry } from '../mockGetFileEntry';
import { mockAddFileEntry } from './mockAddFileEntry';

describe('mockAddFileEntry', () => {
  let root: FsEntry;

  beforeEach(() => {
    root = createTestFsRoot();
  });

  it('throws if the parent file entry does not exist', async () => {
    await expect(async () =>
      mockAddFileEntry(root, { path: 'foo/bar' }, {}),
    ).rejects.toThrow();
  });

  it('throws if the parent file entry is not a directory', () => {
    expect(() =>
      mockAddFileEntry(root, { path: `${documentA1.path}/bar` }, {}),
    ).toThrow('not a dir');
  });

  it('throws if the file entry already exists', async () => {
    await expect(async () =>
      mockAddFileEntry(root, documentA1, {}),
    ).rejects.toThrow();
  });

  it('throws if the file entry exists under another case', async () => {
    await expect(async () =>
      mockAddFileEntry(
        root,
        {
          ...documentA1,
          path: documentA1.path.toUpperCase(),
        },
        {},
      ),
    ).rejects.toThrow();
  });

  it('adds a file entry under another case when case-sensitive', () => {
    const path = `${workspaceA.path}/DOCUMENT 1.md`;

    mockAddFileEntry(
      root,
      { path, name: 'DOCUMENT 1.md' },
      { caseSensitive: true },
    );

    expect(mockExists(root, path, { caseSensitive: true })).toBe(true);
    expect(mockExists(root, documentA1.path, { caseSensitive: true })).toBe(
      true,
    );
  });

  it("adds the file entry below the parent directory's stored path", () => {
    const fileEntry: FsEntry = {
      path: `${workspaceA.path.toLowerCase()}/New file.md`,
      name: 'New file.md',
    };

    mockAddFileEntry(root, fileEntry, {});

    expect(
      mockGetFileEntry(root, `${workspaceA.path}/New file.md`, {}).path,
    ).toBe(`${workspaceA.path}/New file.md`);
  });

  it('adds the file entry', () => {
    const fileEntry: FsEntry = {
      path: `${workspaceA.path}/New file.md`,
      name: 'New file.md',
    };

    mockAddFileEntry(root, fileEntry, {});

    expect(mockExists(root, fileEntry.path, {})).toBe(true);
  });

  it('adds root entries to the root', () => {
    const fileEntry: FsEntry = {
      path: 'foo',
      name: 'foo',
    };

    mockAddFileEntry(root, fileEntry, {});

    expect(mockExists(root, 'foo', {})).toBe(true);
  });
});
