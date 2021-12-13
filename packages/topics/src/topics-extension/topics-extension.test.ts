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

    describe('topics resource registration', () => {
      it('loads topics', () => {
        const { result } = renderHook(() => useAllTopics());
        const topic = generateTopic();

        onRun(core);

        act(() => {
          const [connector] = core.getResourceConnectors();
          connector.onLoad([topic]);
        });

        expect(result.current[topic.id]).toBeDefined();
      });

      it('handles added/updated topics', () => {
        const { result } = renderHook(() => useAllTopics());
        const topic = generateTopic();

        onRun(core);

        act(() => {
          const [connector] = core.getResourceConnectors();
          connector.onChange(topic, false);
        });

        expect(result.current[topic.id]).toBeDefined();
      });

      it('handles deleted topics', () => {
        const { result } = renderHook(() => useAllTopics());
        const topic = generateTopic();

        onRun(core);

        act(() => {
          const [connector] = core.getResourceConnectors();
          connector.onLoad([topic]);
          connector.onChange(topic, true);
        });

        expect(result.current[topic.id]).not.toBeDefined();
      });
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
