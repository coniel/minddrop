import { describe, it, expect, vi } from 'vitest';
import { registerFileSystemAdapter, FileSystem } from '@minddrop/core';
import { incrementalPath } from './incrementalPath';

export const MockFsAdapter: FileSystem = {
  getDirPath: vi.fn(),
  copyFile: vi.fn(),
  createDir: vi.fn(),
  exists: vi.fn(),
  readBinaryFile: vi.fn(),
  readDir: vi.fn(),
  readTextFile: vi.fn(),
  removeDir: vi.fn(),
  removeFile: vi.fn(),
  renameFile: vi.fn(),
  writeBinaryFile: vi.fn(),
  writeTextFile: vi.fn(),
};

describe('incrementalFilename', () => {
  it('returns the path as is if the path does not alredy exist', async () => {
    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists: vi.fn().mockResolvedValue(false),
    });

    const path = await incrementalPath('/foo');

    expect(path).toBe('/foo');
  });

  it('increments path if the path already exists', async () => {
    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists: vi
        .fn()
        .mockImplementation(
          (path) => new Promise((resolve) => resolve(path === '/foo')),
        ),
    });

    const path = await incrementalPath('/foo');

    expect(path).toBe('/foo 1');
  });

  it('recursively increments path if incremented path already exists', async () => {
    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists: vi
        .fn()
        .mockImplementation(
          (path) =>
            new Promise((resolve) =>
              resolve(['/foo', '/foo 1', '/foo 2'].includes(path)),
            ),
        ),
    });

    const path = await incrementalPath('/foo');

    expect(path).toBe('/foo 3');
  });

  it('adds increment suffix before file extension', async () => {
    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists: vi
        .fn()
        .mockImplementation(
          (path) => new Promise((resolve) => resolve(path === '/foo.md')),
        ),
    });

    const path = await incrementalPath('/foo.md');

    expect(path).toBe('/foo 1.md');
  });
});
