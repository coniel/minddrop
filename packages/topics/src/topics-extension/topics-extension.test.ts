import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { onDisable, onRun } from './topics-extension';
import { generateTopic } from '../generateTopic';
import { useAllTopics } from '../useAllTopics';

let core = initializeCore('topics');

describe('topics extension', () => {
  describe('onRun', () => {
    afterEach(() => {
      act(() => {
        core.dispatch('topics:clear');
      });
      core = initializeCore('topics');
    });

    it("reacts to 'topics:load' events by loading the topics into the store", () => {
      const { result } = renderHook(() => useAllTopics());
      const topic1 = generateTopic();
      const topic2 = generateTopic();

      onRun(core);

      act(() => {
        core.dispatch('topics:load', [topic1, topic2]);
      });

      expect(result.current[topic1.id]).toBeDefined();
      expect(result.current[topic2.id]).toBeDefined();
    });

    it("reacts to 'topics:clear' events by clearing the topics store", () => {
      const { result } = renderHook(() => useAllTopics());
      const topic1 = generateTopic();
      const topic2 = generateTopic();

      onRun(core);

      act(() => {
        core.dispatch('topics:load', [topic1, topic2]);
        core.dispatch('topics:clear');
      });

      expect(result.current[topic1.id]).not.toBeDefined();
      expect(result.current[topic2.id]).not.toBeDefined();
    });

    it("reacts to 'topics:create' events by adding the new topic to the store", () => {
      const { result } = renderHook(() => useAllTopics());
      const topic = generateTopic();

      onRun(core);

      act(() => {
        core.dispatch('topics:create', topic);
      });

      expect(result.current[topic.id]).toBeDefined();
    });

    it("reacts to 'topics:update' events by updating the topic in the store", () => {
      const { result } = renderHook(() => useAllTopics());
      const topic = generateTopic();

      onRun(core);

      act(() => {
        core.dispatch('topics:create', topic);
        core.dispatch('topics:update', {
          before: topic,
          after: {
            ...topic,
            title: 'Updated title',
          },
          changes: { title: 'Updated title' },
        });
      });

      expect(result.current[topic.id].title).toBe('Updated title');
    });

    it("reacts to 'topics:delete-permanently' events by removing the topic from the store", () => {
      const { result } = renderHook(() => useAllTopics());
      const topic = generateTopic();

      onRun(core);

      act(() => {
        core.dispatch('topics:create', topic);
        core.dispatch('topics:delete-permanently', topic);
      });

      expect(result.current[topic.id]).not.toBeDefined();
    });
  });

  describe('onDisable', () => {
    afterEach(() => {
      act(() => {
        core.dispatch('topics:clear');
      });
      core = initializeCore('topics');
    });

    it('clears the store', () => {
      const { result } = renderHook(() => useAllTopics());
      const topic1 = generateTopic();
      const topic2 = generateTopic();

      onRun(core);

      act(() => {
        core.dispatch('topics:load', [topic1, topic2]);
        onDisable(core);
      });

      expect(result.current[topic1.id]).not.toBeDefined();
      expect(result.current[topic2.id]).not.toBeDefined();
    });

    it('removes event listeners', () => {
      const { result } = renderHook(() => useAllTopics());
      const topic1 = generateTopic();
      const topic2 = generateTopic();

      onRun(core);

      act(() => {
        onDisable(core);
        core.dispatch('topics:load', [topic1, topic2]);
      });

      expect(result.current[topic1.id]).not.toBeDefined();
      expect(result.current[topic2.id]).not.toBeDefined();
    });
  });
});
