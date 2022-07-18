import { Drops, DROPS_TEST_DATA } from '@minddrop/drops';
import { setup, cleanup, core } from '../test-utils';
import { Topics } from '../Topics';
import { addDropsToTopic } from '../addDropsToTopic';
import { TopicsResource } from '../TopicsResource';
import { onDisable, onRun } from './topics-extension';
import { addSubtopics } from '../addSubtopics';

const { dropConfig } = DROPS_TEST_DATA;

describe('topics extension', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('onRun', () => {
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
      Topics.addEventListener(core, 'topics:topic:remove-drops', ({ data }) => {
        if (data.topic.id === topic.id && data.drops[drop.id]) {
          done();
        }
      });

      // Delete the drop
      Drops.delete(core, drop.id);
    });

    it('removes deleted subtopics from parent topics', (done) => {
      onRun(core);

      // Create a topic
      const topic = TopicsResource.create(core, { title: 'My topic' });

      // Create a subtopic
      const subtopic = TopicsResource.create(core, { title: 'My subtopic' });

      // Add the subtopic to the topic
      addSubtopics(core, topic.id, [subtopic.id]);

      // Listen for remove-drops event
      Topics.addEventListener(
        core,
        'topics:topic:remove-subtopics',
        ({ data }) => {
          if (data.topic.id === topic.id && data.subtopics[subtopic.id]) {
            done();
          }
        },
      );

      // Delete the subtopic
      Topics.delete(core, subtopic.id);
    });
  });

  describe('onDisable', () => {
    it('removes event listeners', () => {
      // Run the extension
      onRun(core);

      // Add an event listener
      Topics.addEventListener(core, 'topics:topic:create', jest.fn());

      // Disable the extension
      onDisable(core);

      // Should have cleared the event listener
      expect(core.hasEventListeners()).toBe(false);
    });
  });
});
