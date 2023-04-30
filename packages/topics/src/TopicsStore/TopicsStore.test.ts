import { describe, afterEach, it, expect, beforeEach } from 'vitest';
import {
  topics,
  Topic_1,
  Topic_1_1,
  Topic_1_2,
  Topic_1_2_1,
  Topic_2,
  Topic_Unnamed_2,
} from '../test-utils';
import { TopicsStore } from './TopicsStore';

function loadTopics() {
  TopicsStore.getState().load(JSON.parse(JSON.stringify(topics)));
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
      TopicsStore.getState().load({ [Topic_1.name]: Topic_1 });

      // Load another topic into the store
      TopicsStore.getState().load({ [Topic_2.name]: Topic_2 });

      // Both topics should be in the store
      expect(TopicsStore.getState().topics).toEqual({
        [Topic_1.name]: Topic_1,
        [Topic_2.name]: Topic_2,
      });
    });
  });

  describe('add', () => {
    it('adds a root topic to `topics`', () => {
      // Add a root topic to the store
      TopicsStore.getState().add([Topic_1.name], Topic_1);

      // Topic should be in `topics`
      expect(TopicsStore.getState().topics[Topic_1.name]).toEqual(Topic_1);
    });

    it('adds a subtopic to its parent topic', () => {
      // Load topic into the store
      loadTopics();

      // Add Topic_Unnamed_2 as a subtopic on /Topic_1/Topic_1_1
      TopicsStore.getState().add(
        [Topic_1.name, Topic_1_1.name, Topic_Unnamed_2.name],
        Topic_Unnamed_2,
      );

      // Topic_Unnamed_2 should be added to Topic_1_1's subtopics
      expect(
        TopicsStore.getState().topics[Topic_1.name].subtopics[Topic_1_1.name]
          .subtopics,
      ).toMatchObject({
        [Topic_Unnamed_2.name]: Topic_Unnamed_2,
      });
    });

    it('retains current state if path is invalid', () => {
      // Load topic into the store
      loadTopics();

      // Attempts to add Topic_Unnamed_2 as a subtopic on an
      // invalid path.
      TopicsStore.getState().add(['some', 'invalid', 'path'], Topic_Unnamed_2);

      // Topic should remain unchanged
      expect(TopicsStore.getState().topics).toMatchObject(topics);
    });

    it('retains current state if path is empty', () => {
      // Load topic into the store
      loadTopics();

      // Attempts to add Topic_Unnamed_2 as a subtopic on an
      // empty path.
      TopicsStore.getState().add([], Topic_Unnamed_2);

      // Topic should remain unchanged
      expect(TopicsStore.getState().topics).toMatchObject(topics);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      // Load topics into the store
      loadTopics();
    });

    it('removes root topics', () => {
      // Remove a root topic
      TopicsStore.getState().remove([Topic_1.name]);

      // Topic should no longer be in the store
      expect(TopicsStore.getState().topics[Topic_1.name]).toBeUndefined();
    });

    it('removes subtopics', () => {
      // Remove the 'Topic 1.2.1' subtopic
      TopicsStore.getState().remove([
        Topic_1.name,
        Topic_1_2.name,
        Topic_1_2_1.name,
      ]);

      // Subtopic should no longer be in the store
      expect(
        TopicsStore.getState().topics[Topic_1.name].subtopics[Topic_1_2.name]
          .subtopics[Topic_1_2_1.name],
      ).toBeUndefined();
    });

    it('retains current state if path is invalid', () => {
      // Attempts to remove from invalid path
      TopicsStore.getState().remove(['some', 'invalid', 'path']);

      // Topic should remain unchanged
      expect(TopicsStore.getState().topics).toMatchObject(topics);
    });

    it('retains current state if path is empty', () => {
      // Attempts to remove without a path
      TopicsStore.getState().remove([]);

      // Topic should remain unchanged
      expect(TopicsStore.getState().topics).toMatchObject(topics);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      // Load topics into the store
      loadTopics();
    });

    it('updates root topics', () => {
      // Update the name of a root topic
      TopicsStore.getState().update([Topic_1.name], { name: 'New name' });

      // Should update the topic
      expect(TopicsStore.getState().topics[Topic_1.name].name).toBe('New name');
    });

    it('updates subtopics', () => {
      // Update the name of the 'Topic 1.2.1' subtopic
      TopicsStore.getState().update(
        [Topic_1.name, Topic_1_2.name, Topic_1_2_1.name],
        { name: 'New name' },
      );

      // Should update the topic
      expect(
        TopicsStore.getState().topics[Topic_1.name].subtopics[Topic_1_2.name]
          .subtopics[Topic_1_2_1.name].name,
      ).toBe('New name');
    });

    it('retains current state if path is invalid', () => {
      // Attempts to update an invalid path
      TopicsStore.getState().update(['some', 'invalid', 'path'], {
        name: 'New name',
      });

      // Topic should remain unchanged
      expect(TopicsStore.getState().topics).toMatchObject(topics);
    });

    it('retains current state if path is empty', () => {
      // Attempts to update an empty path
      TopicsStore.getState().update([], {
        name: 'New name',
      });

      // Topic should remain unchanged
      expect(TopicsStore.getState().topics).toMatchObject(topics);
    });
  });
});
