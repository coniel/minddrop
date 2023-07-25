import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { setup, cleanup } from '../test-utils';
import { readTopic } from './readTopic';
import { FileNotFoundError, registerFileSystemAdapter } from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';

const exists = vi.fn();
const readTextFile = vi.fn();

const mdContent = '# Topic title';

describe('readTopic', () => {
  beforeEach(() => {
    setup();

    exists.mockResolvedValue(true);
    readTextFile.mockResolvedValue(mdContent);

    registerFileSystemAdapter({ ...MockFsAdapter, readTextFile, exists });
  });

  afterEach(cleanup);

  it('throws if the file does not exist', () => {
    // Pretend 'foo.md' does not exist
    exists.mockImplementation(
      (path) => new Promise((resolve) => resolve(path !== 'foo.md')),
    );

    // Should throw a FileNotFoundError
    expect(() => readTopic('foo.md')).rejects.toThrowError(FileNotFoundError);
  });

  describe('file topic', () => {
    it('returns the file contents', async () => {
      // Get the contents of a file topic
      const content = await readTopic('foo.md');

      // Should return the file contents
      expect(content).toEqual(mdContent);
    });
  });

  describe('directory topic', () => {
    it('returns the associated file contents', async () => {
      // Get the contents of a directory topic
      const content = await readTopic('foo');

      // Should return the contents of the topic file
      expect(content).toEqual(mdContent);
    });

    it('returns `null` if the directory has no associated file', async () => {
      // Pretend 'foo/foo.md' does not exist
      exists.mockImplementation(
        (path) => new Promise((resolve) => resolve(path !== 'foo/foo.md')),
      );

      // Get the contents of a directory topic which has
      // no associated file.
      const content = await readTopic('foo');

      // Should return `null`
      expect(content).toBeNull();
    });
  });
});
