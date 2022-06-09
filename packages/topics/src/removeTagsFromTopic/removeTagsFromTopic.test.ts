import { mapById } from '@minddrop/utils';
import { cleanup, core, setup, tSailing } from '../test-utils';
import { TAGS_TEST_DATA } from '@minddrop/tags';
import { removeTagsFromTopic } from './removeTagsFromTopic';
import { addTagsToTopic } from '../addTagsToTopic';
import { TopicsResource } from '../TopicsResource';

const { tag1 } = TAGS_TEST_DATA;

describe('removeTagsFromTopic', () => {
  beforeEach(() => {
    setup();

    // Add a tag to a topic
    addTagsToTopic(core, tSailing.id, [tag1.id]);
  });

  afterEach(cleanup);

  it('removes tags from the topic', () => {
    // Remove a tag from a topic
    removeTagsFromTopic(core, tSailing.id, [tag1.id]);

    // Topic should no longer contain the tag ID
    expect(TopicsResource.get(tSailing.id).tags.includes(tag1.id)).toBeFalsy();
  });

  it("dispatches a 'topics:remove-tags' event", (done) => {
    // Listen to 'topics:topic:remove-tags' events
    core.addEventListener('topics:topic:remove-tags', (payload) => {
      // Get the updated topic
      const topic = TopicsResource.get(tSailing.id);

      // Payload data should contain the updated topic
      expect(payload.data.topic).toEqual(topic);
      // Payload data should contain the removed tags
      expect(payload.data.tags).toEqual(mapById([tag1]));
      done();
    });

    // Remove a tag from a topic
    removeTagsFromTopic(core, tSailing.id, [tag1.id]);
  });
});
