import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { setup, cleanup, Topic_1, Topic_1_1 } from '../test-utils';
import { writeTopic } from './writeTopic';
import { NotFoundError, registerFileSystemAdapter } from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';

const exists = vi.fn();
const writeTextFile = vi.fn();

describe('writeTopic', () => {
  beforeEach(() => {
    setup();

    // Pretend topic file exists
    exists.mockResolvedValue(true);

    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists,
      writeTextFile,
    });
  });

  afterEach(() => {
    cleanup();

    vi.resetAllMocks();
  });

  it('throws if the topic does not exist', () => {
    // Pretend topic file does not exist
    exists.mockResolvedValueOnce(false);

    // Attempt to write to a topic which does not exist.
    // Should throw a `NotFoundError`.
    expect(() => writeTopic('/foo', '# Title')).rejects.toThrowError(
      NotFoundError,
    );
  });

  it('writes the markdown to the topic file', async () => {
    const markdown = '# Title';

    // Write to the file of a file topic
    await writeTopic(Topic_1_1.path, markdown);

    // Should write to the topic file
    expect(writeTextFile).toHaveBeenCalledWith(Topic_1_1.path, markdown);
  });

  it('writes the markdown to the topic file of directory topics', async () => {
    const markdown = '# Title';

    // Write to the file of a directory topic
    await writeTopic(Topic_1.path, markdown);

    // Should write to the topic file
    expect(writeTextFile).toHaveBeenCalledWith(
      `${Topic_1.path}/${Topic_1.title}.md`,
      markdown,
    );
  });
});
