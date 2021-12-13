import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import {
  Tags,
  onRun as onRunTags,
  onDisable as onDisableTags,
  Tag,
  TagNotFoundError,
} from '@minddrop/tags';
import { onRun, onDisable } from '../topics-extension';
import { addTagsToTopic } from './addTagsToTopic';
import { Topic } from '../types';
import { createTopic } from '../createTopic';

let core = initializeCore('topics');

// Run tags extension
onRunTags(core);
// Run topics extension
onRun(core);

describe('addTagsToTopic', () => {
  afterEach(() => {
    core = initializeCore('topics');
    act(() => {
      onDisableTags(core);
      onDisable(core);
      onRunTags(core);
      onRun(core);
    });
  });

  it('adds tags to the topic', async () => {
    let topic: Topic;
    let tagRef: Tag;

    await act(async () => {
      tagRef = await Tags.create(core, { label: 'Tag' });
      topic = createTopic(core);
      topic = addTagsToTopic(core, topic.id, [tagRef.id]);
    });

    expect(topic.tags).toBeDefined();
    expect(topic.tags.length).toBe(1);
    expect(topic.tags[0]).toBe(tagRef.id);
  });

  it('throws if tag attachement does not exist', async () => {
    let topic: Topic;

    await act(async () => {
      topic = createTopic(core);
    });
    expect(() =>
      addTagsToTopic(core, topic.id, ['missing-tag-id']),
    ).toThrowError(TagNotFoundError);
  });

  it("dispatches a 'topics:add-tags' event", async () => {
    const callback = jest.fn();
    let topic: Topic;
    let tagRef: Tag;

    core.addEventListener('topics:add-tags', callback);

    await act(async () => {
      tagRef = await Tags.create(core, { label: 'Tag' });
      topic = createTopic(core);
      topic = addTagsToTopic(core, topic.id, [tagRef.id]);
    });

    expect(callback).toHaveBeenCalledWith({
      source: 'topics',
      type: 'topics:add-tags',
      data: { topic, tags: { [tagRef.id]: tagRef } },
    });
  });
});
