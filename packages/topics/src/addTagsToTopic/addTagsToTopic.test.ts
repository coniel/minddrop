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

let core = initializeCore({ appId: 'app-id', extensionId: 'topics' });

// Run tags extension
onRunTags(core);
// Run topics extension
onRun(core);

describe('addTagsToTopic', () => {
  afterEach(() => {
    core = initializeCore({ appId: 'app-id', extensionId: 'topics' });
    act(() => {
      onDisableTags(core);
      onDisable(core);
      onRunTags(core);
      onRun(core);
    });
  });

  it('adds tags to the topic', async () => {
    let topic: Topic;
    let tag: Tag;

    await act(async () => {
      tag = await Tags.create(core, { label: 'Tag' });
      topic = createTopic(core);
      topic = addTagsToTopic(core, topic.id, [tag.id]);
    });

    expect(topic.tags).toBeDefined();
    expect(topic.tags.length).toBe(1);
    expect(topic.tags[0]).toBe(tag.id);
  });

  it('throws if tag does not exist', async () => {
    let topic: Topic;

    await act(async () => {
      topic = createTopic(core);
    });
    expect(() =>
      addTagsToTopic(core, topic.id, ['missing-tag-id']),
    ).toThrowError(TagNotFoundError);
  });

  it("dispatches a 'topics:add-tags' event", (done) => {
    let topic: Topic;
    let tag: Tag;

    function callback(payload) {
      expect(payload.data.topic).toEqual(topic);
      expect(payload.data.tags).toEqual({ [tag.id]: tag });
      done();
    }

    core.addEventListener('topics:add-tags', callback);

    act(() => {
      tag = Tags.create(core, { label: 'Tag' });
      topic = createTopic(core);
      topic = addTagsToTopic(core, topic.id, [tag.id]);
    });
  });
});
