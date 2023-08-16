import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { setup, cleanup, Topic_1, Topic_1_1 } from '../test-utils';
import { addDropsToTopic } from './addDropsToTopic';
import { NotFoundError, registerFileSystemAdapter } from '@minddrop/core';
import { MockFsAdapter } from '@minddrop/test-utils';
import { DROPS_TEST_DATA } from '@minddrop/drops';
import { initializeTopicContent } from '../initializeTopicContent';
import { getTopic } from '../getTopic';
import { Topic } from '../types';

vi.mock('uuid', () => ({
  v4: () => 'uuid',
}));

const { drop1, drop2 } = DROPS_TEST_DATA;

const readTextFile = vi.fn();
const exists = vi.fn();

describe('addDropsToTopic', () => {
  beforeEach(() => {
    setup();

    // Pretend files exist
    exists.mockResolvedValue(true);

    registerFileSystemAdapter({
      ...MockFsAdapter,
      readTextFile,
      exists,
    });
  });

  afterEach(cleanup);

  it('throws if the topic does not exist', () => {
    // Attempt to add drops to a topic which does not exist.
    // Should throw a NotFoundError.
    expect(() => addDropsToTopic('missing', [drop1])).rejects.toThrowError(
      NotFoundError,
    );
  });

  it('gets topic contents from markdown file if not present on store topic', async () => {
    // Add a drop to a topic with no store content
    await addDropsToTopic(Topic_1_1.path, [drop1]);

    // Should get content from topic markdown file
    expect(readTextFile).toHaveBeenCalledWith(Topic_1_1.path);
  });

  it('initializes topic contents if it has none', async () => {
    // Add a drop to a topic with no content
    const topic = await addDropsToTopic(Topic_1.path, [drop1]);

    // Should initialize the topic's content and add
    // the drop to it.
    expect(topic.content?.markdown).toEqual(
      `# ${Topic_1.title}\n\n${drop1.markdown}\n\n---\n\n---\n`,
    );
  });

  it('adds drops to the end of the first column if no index is specified', async () => {
    // Add a drop to the topic
    await addDropsToTopic(Topic_1.path, [drop1]);

    // Add a second drop to the topic
    const topic = await addDropsToTopic(Topic_1.path, [drop2]);

    // Should add the drops in order to the first column
    expect(topic.content?.markdown).toEqual(
      `# ${Topic_1.title}\n\n${drop1.markdown}\n\n${drop2.markdown}\n\n---\n\n---\n`,
    );
  });

  it('adds drops to the specified column index', async () => {
    // Add a drop to the second column of a topic
    const topic = await addDropsToTopic(Topic_1.path, [drop1], 1);

    // Should add the drop to the second column
    expect(topic.content?.markdown).toEqual(
      `# ${Topic_1.title}\n\n---\n\n${drop1.markdown}\n\n---\n`,
    );
  });

  it('adds drops to the specified drop index', async () => {
    // Add a drop to a topic
    await addDropsToTopic(Topic_1.path, [drop1]);

    // Add a second drop before the first one
    const topic = await addDropsToTopic(Topic_1.path, [drop2], 0, 0);

    // Should add the second drop before the frist one
    expect(topic.content?.markdown).toEqual(
      `# ${Topic_1.title}\n\n${drop2.markdown}\n\n${drop1.markdown}\n\n---\n\n---\n`,
    );
  });

  it('updates the topic in the store', async () => {
    // Add a drop to a topic
    const updated = await addDropsToTopic(Topic_1.path, [drop1]);

    // Get the topic from the store
    const topic = getTopic(Topic_1.path);

    // Store topic should be updated
    expect((topic as Topic).content?.markdown).toEqual(
      `# ${Topic_1.title}\n\n${drop1.markdown}\n\n---\n\n---\n`,
    );
  });
});
