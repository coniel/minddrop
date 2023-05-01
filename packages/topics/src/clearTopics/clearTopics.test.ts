import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { setup, cleanup } from '../test-utils';
import { TopicsStore } from '../TopicsStore';
import { clearTopics } from './clearTopics';

describe('clearTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('clears all topics from the store', () => {
    // Clear topics
    clearTopics();

    // Topics should be cleared
    expect(TopicsStore.getState().topics).toEqual([]);
  });
});
