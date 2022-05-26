import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { onDisable, onRun } from './topics-extension';
import { Topics } from '../Topics';
import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { addDropsToTopic } from '../addDropsToTopic';
import { TopicsResource } from '../TopicsResource';

let core = initializeCore({ appId: 'app-id', extensionId: 'topics' });

const { dropConfig } = DROPS_TEST_DATA;

describe('topics extension', () => {
  describe('onRun', () => {
    afterEach(() => {
      act(() => {
        core.dispatch('topics:clear');
      });
      core = initializeCore({ appId: 'app-id', extensionId: 'topics' });
    });

    it('removes deleted drops from parent topics', (done) => {
      onRun(core);

      // Create a topic
      const topic = TopicsResource.create(core, { title: 'My topic' });

      // Create a drop
      Drops.register(core, dropConfig);
      const drop = Drops.create(core, dropConfig.type);

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
