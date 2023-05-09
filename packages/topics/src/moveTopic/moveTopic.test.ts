import { MockFsAdapter } from '@minddrop/test-utils';
import {
  Fs,
  InvalidParameterError,
  NotFoundError,
  registerFileSystemAdapter,
} from '@minddrop/core';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import {
  setup,
  cleanup,
  core,
  Topic_1,
  Topic_Untitled,
  Topic_2,
} from '../test-utils';
import * as util from '../topicToDirectory';
import { moveTopic } from './moveTopic';

describe('moveTopic', () => {
  beforeEach(() => {
    setup();

    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists: vi.fn().mockResolvedValue(true),
    });
  });

  afterEach(cleanup);

  it('throws if the topic does not exist', () => {
    expect(() => moveTopic(core, '/from/Foo', '/to/Foo')).rejects.toThrowError(
      NotFoundError,
    );
  });

  it('throws if the topic path does not exist', () => {
    registerFileSystemAdapter({
      ...MockFsAdapter,
      // Emulate topic path does not exist
      exists: vi
        .fn()
        .mockImplementation(
          (path) => new Promise((resolve) => resolve(path !== Topic_1.path)),
        ),
    });

    expect(() =>
      moveTopic(core, Topic_1.path, 'destination/path'),
    ).rejects.toThrowError(NotFoundError);
  });

  it('throws if the destination path does not exist', () => {
    registerFileSystemAdapter({
      ...MockFsAdapter,
      // Emulate destination path does not exist
      exists: vi
        .fn()
        .mockImplementation(
          (path) =>
            new Promise((resolve) => resolve(path !== '/destination/path')),
        ),
    });

    expect(() =>
      moveTopic(core, Topic_1.path, '/destination/path'),
    ).rejects.toThrowError(InvalidParameterError);
  });

  it('moves topic file to the new path', async () => {
    vi.spyOn(Fs, 'renameFile');

    // The final path of the topic after it is moved
    const newPath = `${Topic_1.path}/${Topic_Untitled.title}.md`;

    registerFileSystemAdapter({
      ...MockFsAdapter,
      // New topic path should not exist
      exists: vi
        .fn()
        .mockImplementation(
          (path) => new Promise((resolve) => resolve(path !== newPath)),
        ),
    });

    // Move Topic Untitled (file) into Topic 1 (directory)
    await moveTopic(core, Topic_Untitled.path, Topic_1.path);

    // Should move the topic file
    expect(Fs.renameFile).toHaveBeenCalledWith(Topic_Untitled.path, newPath);
  });

  it('moves topic directory to the new path', async () => {
    vi.spyOn(Fs, 'renameFile');

    // The final path of the topic after it is moved
    const newPath = `${Topic_2.path}/${Topic_1.title}`;

    registerFileSystemAdapter({
      ...MockFsAdapter,
      // New topic path should not exist
      exists: vi
        .fn()
        .mockImplementation(
          (path) => new Promise((resolve) => resolve(path !== newPath)),
        ),
    });

    // Move Topic 1 (directory) into Topic 2 (directory)
    await moveTopic(core, Topic_1.path, Topic_2.path);

    // Should move the topic file
    expect(Fs.renameFile).toHaveBeenCalledWith(Topic_1.path, newPath);
  });

  it('adds incremental suffix if destination conflicts with existing topic', async () => {
    vi.spyOn(Fs, 'renameFile');

    // Emulate that Topic 1 contains a 'Untitled.md' file,
    // but not 'Untitled 1.md' file.
    registerFileSystemAdapter({
      ...MockFsAdapter,
      // Emulate destination path does not exist
      exists: vi
        .fn()
        .mockImplementation(
          (path) =>
            new Promise((resolve) =>
              resolve(path !== `${Topic_1.path}/Untitled 1.md`),
            ),
        ),
    });

    // Move Topic Untitled into Topic 1
    await moveTopic(core, Topic_Untitled.path, Topic_1.path);

    // Should rename the topic file to 'Untitled 1'
    expect(Fs.renameFile).toHaveBeenCalledWith(
      Topic_Untitled.path,
      `${Topic_1.path}/Untitled 1.md`,
    );
  });

  it('converts destination topic into a directory if it is a file', async () => {
    vi.spyOn(util, 'topicToDirectory');

    registerFileSystemAdapter({
      ...MockFsAdapter,
      // Emulate destination path does not exist
      exists: vi
        .fn()
        .mockImplementation(
          (path) =>
            new Promise((resolve) =>
              resolve(
                path !== Topic_Untitled.path.slice(0, -3) &&
                  path !==
                    `${Topic_Untitled.path.slice(0, -3)}/${Topic_1.title}`,
              ),
            ),
        ),
    });

    // Move Topic 1 into Topic Untitled (file topic)
    await moveTopic(core, Topic_1.path, Topic_Untitled.path);
  });
});
