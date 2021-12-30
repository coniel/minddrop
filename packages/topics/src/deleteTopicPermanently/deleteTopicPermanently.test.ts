import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { onDisable, onRun } from '../topics-extension';
import { createTopic } from '../createTopic';
import { Topic } from '../types';
import { deleteTopicPermanently } from './deleteTopicPermanently';
import { getTopic } from '../getTopic';
import { TopicNotFoundError } from '../errors';

let core = initializeCore({ appId: 'app-id', extensionId: 'topics' });

// Set up extension
onRun(core);

describe('deleteTopicPermanently', () => {
  afterEach(() => {
    // Reset extension
    onDisable(core);
    core = initializeCore({ appId: 'app-id', extensionId: 'topics' });
    onRun(core);
  });

  it('returns the deleted topic', () => {
    let topic: Topic;
    let deletedTopic: Topic;

    act(() => {
      topic = createTopic(core);
      deletedTopic = deleteTopicPermanently(core, topic.id);
    });

    expect(deletedTopic).toEqual(topic);
  });

  it('removes topic from the store', () => {
    let topic: Topic;

    act(() => {
      topic = createTopic(core);
      deleteTopicPermanently(core, topic.id);
    });

    expect(() => getTopic(topic.id)).toThrowError(TopicNotFoundError);
  });

  it("dispatches a 'topics:delete-permanently' event", (done) => {
    let topic: Topic;

    function callback(payload) {
      expect(payload.data).toEqual(topic);
      done();
    }

    core.addEventListener('topics:delete-permanently', callback);

    act(() => {
      topic = createTopic(core);
    });

    deleteTopicPermanently(core, topic.id);
  });
});
