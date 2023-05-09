import { MockFsAdapter } from '@minddrop/test-utils';
import { Fs, NotFoundError, registerFileSystemAdapter } from '@minddrop/core';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { setup, cleanup, core, Topic_Untitled, Topic_1 } from '../test-utils';
import { topicToDirectory } from './topicToDirectory';

describe('topicToDirectory', () => {
  beforeEach(() => {
    setup();
    registerFileSystemAdapter(MockFsAdapter);
  });

  afterEach(cleanup);

  it('throws if the topic does not exist', () => {
    expect(() => topicToDirectory(core, '/missing')).rejects.toThrowError(
      NotFoundError,
    );
  });

  it('throws if the topic path does not exist', () => {
    registerFileSystemAdapter({
      ...MockFsAdapter,
      // Pretend Topic 1 path does not exist
      exists: vi
        .fn()
        .mockImplementation(
          (path) => new Promise((resolve) => resolve(path !== Topic_1.path)),
        ),
    });

    expect(() => topicToDirectory(core, Topic_1.path)).rejects.toThrowError(
      NotFoundError,
    );
  });

  it('creates the topic directory', async () => {
    vi.spyOn(Fs, 'createDir');

    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists: vi
        .fn()
        .mockImplementation(
          (path) =>
            new Promise((resolve) => resolve(path === Topic_Untitled.path)),
        ),
    });

    await topicToDirectory(core, Topic_Untitled.path);

    // Should create a directory using the topic title
    expect(Fs.createDir).toHaveBeenCalledWith(Topic_Untitled.path.slice(0, -3));
  });

  it('moves the topic files into the directory', async () => {
    vi.spyOn(Fs, 'renameFile');

    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists: vi
        .fn()
        .mockImplementation(
          (path) =>
            new Promise((resolve) => resolve(path === Topic_Untitled.path)),
        ),
    });

    await topicToDirectory(core, Topic_Untitled.path);

    // Should move topic file into the new directory
    expect(Fs.renameFile).toHaveBeenCalledWith(
      Topic_Untitled.path,
      `${Topic_Untitled.path.slice(0, -3)}/${Topic_Untitled.title}.md`,
    );
  });

  it('generates incremental path to avoid conflicts', async () => {
    vi.spyOn(Fs, 'createDir');
    vi.spyOn(Fs, 'renameFile');

    registerFileSystemAdapter({
      ...MockFsAdapter,
      // Pretend both Topic Untitled file and directory paths
      // already exist.
      exists: vi
        .fn()
        .mockImplementation(
          (path) =>
            new Promise((resolve) =>
              resolve(
                path === Topic_Untitled.path ||
                  path === Topic_Untitled.path.slice(0, -3),
              ),
            ),
        ),
    });

    await topicToDirectory(core, Topic_Untitled.path);

    // Should add increment to directory name
    expect(Fs.createDir).toHaveBeenCalledWith(
      `${Topic_Untitled.path.slice(0, -3)} 1`,
    );
    // Should add increment to topic filename
    expect(Fs.renameFile).toHaveBeenCalledWith(
      Topic_Untitled.path,
      `${Topic_Untitled.path.slice(0, -3)} 1/${Topic_Untitled.title} 1.md`,
    );
  });

  it('does nothing if the topic is already a directory', async () => {
    vi.spyOn(Fs, 'createDir');
    vi.spyOn(Fs, 'renameFile');

    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists: vi.fn().mockResolvedValue(true),
    });

    const newPath = await topicToDirectory(core, Topic_1.path);

    // Should not create directory
    expect(Fs.createDir).not.toHaveBeenCalled();
    // Should not move file
    expect(Fs.renameFile).not.toHaveBeenCalled();
    // Should not update path
    expect(newPath).toBe(Topic_1.path);
  });

  it('returns the new topic path', async () => {
    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists: vi
        .fn()
        .mockImplementation(
          (path) =>
            new Promise((resolve) => resolve(path === Topic_Untitled.path)),
        ),
    });

    const newPath = await topicToDirectory(core, Topic_Untitled.path);

    expect(newPath).toEqual(Topic_Untitled.path.slice(0, -3));
  });
});
