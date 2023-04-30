import { describe, afterEach, it, expect, beforeEach } from 'vitest';
import { topics, Topic_1, Topic_2 } from '../test-utils';
import { TopicsStore } from './TopicsStore';

function loadTopics() {
  TopicsStore.getState().load(topics);
}

describe('TopicsStore', () => {
  afterEach(() => {
    TopicsStore.getState().clear();
  });

  describe('load', () => {
    it('loads topics into the store', () => {
      // Load topics into the store
      TopicsStore.getState().load(topics);

      // Topics should be in the store
      expect(TopicsStore.getState().topics).toEqual(topics);
    });

    it('maintains existing topics', () => {
      // Load a topic into the store
      TopicsStore.getState().load([Topic_1]);

      // Load another topic into the store
      TopicsStore.getState().load([Topic_2]);

      // Both topics should be in the store
      expect(TopicsStore.getState().topics).toEqual([Topic_1, Topic_2]);
    });
  });

  describe('add', () => {
    it('adds a topic to the store', () => {
      // Add a topic to the store
      TopicsStore.getState().add(Topic_1);

      // Topic should be in `topics`
      expect(TopicsStore.getState().topics).toEqual([Topic_1]);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      // Load topics into the store
      loadTopics();
    });

    it('removes the topic from the store', () => {
      // Remove a topic
      TopicsStore.getState().remove(Topic_1.path);

      // Topic should no longer be in the store
      expect(
        TopicsStore.getState().topics.find(
          (topic) => topic.path === Topic_1.path,
        ),
      ).toBeUndefined();
    });
  });

  describe('update', () => {
    beforeEach(() => {
      // Load topics into the store
      loadTopics();
    });

    it('updates a topic in the store', () => {
      // Update the title of a topic
      TopicsStore.getState().update(Topic_1.path, { title: 'New name' });

      // Should update the topic
      expect(
        TopicsStore.getState().topics.find(
          (topic) => topic.path === Topic_1.path,
        )?.title,
      ).toBe('New name');
    });
  });
});
