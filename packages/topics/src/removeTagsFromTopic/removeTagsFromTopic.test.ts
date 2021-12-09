import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  Tags,
  onRun as onRunTags,
  onDisable as onDisableTags,
  Tag,
} from '@minddrop/tags';
import { onRun, onDisable } from '../extension';
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
    let tagRef1: Tag;
    let tagRef2: Tag;

    await act(async () => {
      tagRef1 = await Tags.create(core, { label: 'Tag' });
      tagRef2 = await Tags.create(core, { label: 'Tag' });
      topic = createTopic(core);
      topic = addTagsToTopic(core, topic.id, [tagRef1.id, tagRef2.id]);
      topic = removeTagsFromTopic(core, topic.id, [tagRef1.id]);
    });

    expect(topic.tags).toBeDefined();
    expect(topic.tags.length).toBe(1);
    expect(topic.tags[0]).toBe(tagRef2.id);
  });

  it("dispatches a 'topics:remove-tags' event", async () => {
    const callback = jest.fn();
    let topic: Topic;
    let tagRef: Tag;

    core.addEventListener('topics:remove-tags', callback);

    await act(async () => {
      tagRef = await Tags.create(core, { label: 'Tag' });
      topic = createTopic(core);
      topic = addTagsToTopic(core, topic.id, [tagRef.id]);
      topic = removeTagsFromTopic(core, topic.id, [tagRef.id]);
    });

    expect(callback).toHaveBeenCalledWith({
      source: 'topics',
      type: 'topics:remove-tags',
      data: { topic, tags: { [tagRef.id]: tagRef } },
    });
  });
});
