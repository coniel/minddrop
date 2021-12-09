import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { onDisable, onRun } from '../topics-extension';
import { createTopic } from '../createTopic';
import { Topic } from '../types';
import { deleteTopicPermanently } from './deleteTopicPermanently';

let core = initializeCore('topics');

// Set up extension
onRun(core);

describe('deleteTopic', () => {
  afterEach(() => {
    // Reset extension
    onDisable(core);
    core = initializeCore('topics');
    onRun(core);
  });

  it("dispatches a 'topics:delete-permanently' event", () => {
    const callback = jest.fn();
    let topic: Topic;

    core.addEventListener('topics:delete-permanently', callback);

    act(() => {
      topic = createTopic(core);
    });

    deleteTopicPermanently(core, topic.id);

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0].data).toBe(topic);
  });
});
