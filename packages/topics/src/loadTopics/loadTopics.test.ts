import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { MockFsAdapter, registerFileSystemAdapter } from '@minddrop/core';
import { cleanup, core, topicFiles, topics } from '../test-utils';
import { loadTopics } from './loadTopics';
import { TopicsStore } from '../TopicsStore';

// Return mock topic files when reading directory
MockFsAdapter.readDir = vi.fn().mockResolvedValue(topicFiles);

describe('loadTopics', () => {
  beforeEach(() => {
    // Register mock file system adapter
    registerFileSystemAdapter(MockFsAdapter);
  });

  afterEach(cleanup);

  it('loads topics from the specified directory', async () => {
    // Load topics
    await loadTopics(core, 'workspace');

    // Reads topic files from the specified directory
    expect(MockFsAdapter.readDir).toHaveBeenCalledWith(
      'workspace',
      expect.anything(),
    );
  });

  it('loads topics into the store', async () => {
    // Load topics
    await loadTopics(core, 'workspace');

    // Topics should be in the store
    expect(TopicsStore.getState().topics).toEqual(topics);
  });

  it('dispatches a `topics:load` event', async () =>
    new Promise<void>((done) => {
      // Listen to 'topics:load' events
      core.addEventListener('topics:load', (payload) => {
        // Payload data should be the topics
        expect(payload.data).toEqual(topics);
        done();
      });

      // Load topics
      loadTopics(core, 'workspace');
    }));
});
