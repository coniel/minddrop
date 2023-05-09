import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { MockFsAdapter } from '@minddrop/test-utils';
import { registerFileSystemAdapter } from '@minddrop/core';
import { setup, cleanup, topicFiles, topics } from '../test-utils';
import { getTopicsFromPath } from './getTopicsFromPath';

// Return mock topic files when reading directory
MockFsAdapter.readDir = vi.fn().mockResolvedValue(topicFiles);

describe('getTopicsFromPath', () => {
  beforeEach(() => {
    setup();

    // Register mock file system adapter
    registerFileSystemAdapter(MockFsAdapter);
  });

  afterEach(cleanup);

  it('transforms read files into topics tree', async () => {
    // Get topics from mock directory
    const result = await getTopicsFromPath('');

    expect(result).toEqual(topics);
  });
});
