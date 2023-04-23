import { MockFsAdapter, registerFileSystemAdapter } from '@minddrop/core';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup, topicFiles, topics } from '../test-utils';
import { fileEntriesToTopics } from './fileEntriesToTopics';

describe('fileEntriesToTopics', () => {
  beforeEach(() => {
    setup();

    // Register mock file system adapter
    registerFileSystemAdapter(MockFsAdapter);
  });

  afterEach(cleanup);

  it('transforms file entries into topics', async () => {
    // Get topics from mock directory
    const result = fileEntriesToTopics(topicFiles);

    // Should transform the files into a topics tree
    expect(result).toEqual(topics);
  });
});
