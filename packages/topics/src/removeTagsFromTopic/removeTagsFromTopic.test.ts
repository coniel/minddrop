import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  Tags,
  onRun as onRunTags,
  onDisable as onDisableTags,
  Tag,
} from '@minddrop/tags';
import { onRun, onDisable } from '../topics-extension';
import { removeTagsFromTopic } from './removeTagsFromTopic';
import { Topic } from '../types';
import { createTopic } from '../createTopic';
import { addTagsToTopic } from '../addTagsToTopic';

let core = initializeCore('topics');

// Run tags extension
onRunTags(core);
// Run topics extension
onRun(core);

describe('removeTagsFromTopic', () => {
  afterEach(() => {
    core = initializeCore('topics');
    act(() => {
      onDisableTags(core);
      onDisable(core);
      onRunTags(core);
      onRun(core);
    });
  });

  it('removes tags from the topic', async () => {
    let topic: Topic;
    let tag1: Tag;
    let tag2: Tag;

    await act(async () => {
      tag1 = await Tags.create(core, { label: 'Tag' });
      tag2 = await Tags.create(core, { label: 'Tag' });
      topic = createTopic(core);
      topic = addTagsToTopic(core, topic.id, [tag1.id, tag2.id]);
      topic = removeTagsFromTopic(core, topic.id, [tag1.id]);
    });

    expect(topic.tags).toBeDefined();
    expect(topic.tags.length).toBe(1);
    expect(topic.tags[0]).toBe(tag2.id);
  });

  it("dispatches a 'topics:remove-tags' event", (done) => {
    let topic: Topic;
    let tag: Tag;

    function callback(payload) {
      expect(payload.data.topic).toEqual(topic);
      expect(payload.data.tags).toEqual({ [tag.id]: tag });
      done();
    }

    core.addEventListener('topics:remove-tags', callback);

    act(() => {
      tag = Tags.create(core, { label: 'Tag' });
      topic = createTopic(core);
      topic = addTagsToTopic(core, topic.id, [tag.id]);
      topic = removeTagsFromTopic(core, topic.id, [tag.id]);
    });
  });
});
