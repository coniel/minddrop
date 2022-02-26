import { renderHook, act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { onDisable, onRun } from './topics-extension';
import { generateTopic } from '../generateTopic';
import { useAllTopics } from '../useAllTopics';
import { Topics } from '../Topics';
import { createTopic } from '../createTopic';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { addDropsToTopic } from '../addDropsToTopic';

let core = initializeCore({ appId: 'app-id', extensionId: 'topics' });

const { textDropConfig } = DROPS_TEST_DATA;

describe('topics extension', () => {
  describe('onRun', () => {
    afterEach(() => {
      act(() => {
        core.dispatch('topics:clear');
      });
      core = initializeCore({ appId: 'app-id', extensionId: 'topics' });
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

    it('removes deleted drops from parent topics', (done) => {
      onRun(core);

      // Create a topic
      const topic = createTopic(core);

      // Create a drop
      Drops.register(core, textDropConfig);
      const drop = Drops.create(core, { type: textDropConfig.type });

      // Add the drop to the topic
      addDropsToTopic(core, topic.id, [drop.id]);

      // Listen for remove-drops event
      Topics.addEventListener(core, 'topics:remove-drops', ({ data }) => {
        if (data.topic.id === topic.id && data.drops[drop.id]) {
          done();
        }
      });

      // Delete the drop
      Drops.delete(core, drop.id);
    });
  });

  describe('onDisable', () => {
    afterEach(() => {
      act(() => {
        core.dispatch('topics:clear');
      });
      core = initializeCore({ appId: 'app-id', extensionId: 'topics' });
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
      onRun(core);
      Topics.addEventListener(core, 'topics:create', jest.fn());

      act(() => {
        onDisable(core);
        expect(core.hasEventListeners()).toBe(false);
      });
    });
  });
});
