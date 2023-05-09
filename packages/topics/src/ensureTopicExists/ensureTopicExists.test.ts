import { MockFsAdapter } from '@minddrop/test-utils';
import { NotFoundError, registerFileSystemAdapter } from '@minddrop/core';
import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  beforeAll,
  vi,
} from 'vitest';
import { setup, cleanup, Topic_1 } from '../test-utils';
import { TopicsStore } from '../TopicsStore';
import { ensureTopicExists } from './ensureTopicExists';

describe('ensureTopicExists', () => {
  beforeAll(() => {
    registerFileSystemAdapter({
      ...MockFsAdapter,
      exists: vi
        .fn()
        .mockImplementation(
          (path) => new Promise((resolve) => resolve(path === Topic_1.path)),
        ),
    });
  });

  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the topic file does not exist', async () => {
    // Check if a non-existent topic file exists.
    // Should throw a NotFoundError
    expect(() => ensureTopicExists('/missing/topic.md')).rejects.toThrowError(
      NotFoundError,
    );
  });

  it('throws if the topic is not in the store', async () => {
    // Remove Topic 1 from the store
    TopicsStore.getState().remove(Topic_1.path);

    // Check if Topic 1 exists, should throw a NotFoundError
    expect(() => ensureTopicExists(Topic_1.path)).rejects.toThrowError(
      NotFoundError,
    );
  });

  it('does not throw if topic exists', () => {
    // Check if Topic 1 exists, should not throw
    expect(() => ensureTopicExists(Topic_1.path)).not.toThrowError();
  });
});
