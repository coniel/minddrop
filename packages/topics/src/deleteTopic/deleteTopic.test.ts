import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { onDisable, onRun } from '../extension';
import { createTopic } from '../createTopic';
import { Topic } from '../types';
import { deleteTopic } from './deleteTopic';

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

  it('deletes the topic', () => {
    let topic: Topic;

    act(() => {
      topic = createTopic(core);
    });

    const deleted = deleteTopic(core, topic.id);

    expect(deleted.deleted).toBe(true);
    expect(deleted.deletedAt).toBeDefined();
  });

  it("dispatches a 'topics:delete' event", () => {
    const callback = jest.fn();
    let topic: Topic;

    core.addEventListener('topics:delete', callback);

    act(() => {
      topic = createTopic(core);
    });

    const deleted = deleteTopic(core, topic.id);

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0].data).toBe(deleted);
  });
});
