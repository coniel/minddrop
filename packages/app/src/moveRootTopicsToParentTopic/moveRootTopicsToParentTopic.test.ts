import { Topics, TOPICS_TEST_DATA } from '@minddrop/topics';
import { contains, doesNotContain } from '@minddrop/utils';
import { addRootTopics } from '../addRootTopics';
import { getRootTopics } from '../getRootTopics';
import { setup, cleanup, core } from '../test-utils';
import { moveRootTopicsToParentTopic } from './moveRootTopicsToParentTopic';

const { tSailing } = TOPICS_TEST_DATA;

describe('moveRootTopicsToParentTopic', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the topics from the root level', () => {
    // Create a couple of root level topics
    const topic1 = Topics.create(core);
    const topic2 = Topics.create(core);
    addRootTopics(core, [topic1.id, topic2.id]);

    // Move the new root topics into a parent topic
    moveRootTopicsToParentTopic(core, tSailing.id, [topic1.id, topic2.id]);

    // Get the root topic IDs
    const rootTopicIds = getRootTopics().map((t) => t.id);

    // Moved topics should no longer appear at the root level
    expect(doesNotContain(rootTopicIds, [topic1.id, topic2.id])).toBeTruthy();
  });

  it('adds the topics to the target parent topic', () => {
    // Create a couple of root level topics
    const topic1 = Topics.create(core);
    const topic2 = Topics.create(core);
    addRootTopics(core, [topic1.id, topic2.id]);

    // Move the new root topics into a parent topic
    moveRootTopicsToParentTopic(core, tSailing.id, [topic1.id, topic2.id]);

    // Get the updated parent topic
    const parent = Topics.get(tSailing.id);

    // Parent topic should contain the moved topics
    expect(contains(parent.subtopics, [topic1.id, topic2.id])).toBeTruthy();
  });

  it('adds the topics to the specified position', () => {
    // Create a couple of root level topics
    const topic1 = Topics.create(core);
    const topic2 = Topics.create(core);
    addRootTopics(core, [topic1.id, topic2.id]);

    // Move the new root topics to the top of a parent topic
    moveRootTopicsToParentTopic(core, tSailing.id, [topic1.id, topic2.id], 0);

    // Get the updated parent topic
    const parent = Topics.get(tSailing.id);

    // Should add subtopics to the start of the list
    expect(parent.subtopics).toEqual([
      topic1.id,
      topic2.id,
      ...tSailing.subtopics,
    ]);
  });

  it('dispatches a `app:root-topics:move` event', (done) => {
    // Create a couple of root level topics
    const topic1 = Topics.create(core);
    const topic2 = Topics.create(core);
    addRootTopics(core, [topic1.id, topic2.id]);

    // Listen to 'app:root-topics:move' events
    core.addEventListener('app:root-topics:move', (payload) => {
      // Get the updated parent topic
      const parent = Topics.get(tSailing.id);
      // Get the updated moved topics
      const movedTopics = Topics.get([topic1.id, topic2.id]);

      // Payload data should contain updated parent topic as 'toTopic'
      expect(payload.data.toTopic).toEqual(parent);
      // Payload data should contain updated moved topics as 'topics'
      expect(payload.data.topics).toEqual(movedTopics);
      done();
    });

    // Move the new root topics into a parent topic
    moveRootTopicsToParentTopic(core, tSailing.id, [topic1.id, topic2.id]);
  });
});
