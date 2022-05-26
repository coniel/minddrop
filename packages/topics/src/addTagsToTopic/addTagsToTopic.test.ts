import { TAGS_TEST_DATA } from '@minddrop/tags';
import { setup, cleanup, core, tSailing } from '../test-utils';
import { addTagsToTopic } from './addTagsToTopic';
import { TopicsResource } from '../TopicsResource';
import { mapById } from '@minddrop/utils';

const { tag1 } = TAGS_TEST_DATA;

describe('addTagsToTopic', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds tags to the topic', async () => {
    // Add a tag to a topic
    addTagsToTopic(core, tSailing.id, [tag1.id]);

    // Get the updated topic
    const topic = TopicsResource.get(tSailing.id);

    // Topic should contain the tag ID
    expect(topic.tags.includes(tag1.id)).toBeTruthy();
  });

  it('dispatches a `topics:topic:add-tags` event', (done) => {
    // Listen to 'topics:topic:add-tags' events
    core.addEventListener('topics:topic:add-tags', (payload) => {
      // Get the updated topic
      const topic = TopicsResource.get(tSailing.id);

      // Payload data should contain the topic
      expect(payload.data.topic).toEqual(topic);
      // Payload data should contained the added tags
      expect(payload.data.tags).toEqual(mapById([tag1]));
      done();
    });

    // Add a tag to a topic
    addTagsToTopic(core, tSailing.id, [tag1.id]);
  });
});
