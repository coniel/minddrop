import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { onDisable, onRun } from '../topics-extension';
import { insertData } from './insertData';
import { Topic } from '../types';
import { createTopic } from '../createTopic';

let core = initializeCore('topics');

// Set up extension
onRun(core);

describe('loadTopics', () => {
  afterEach(() => {
    // Reset extension
    onDisable(core);
    core = initializeCore('topics');
    onRun(core);
  });

  it("dispatches a 'topics:load' event", () => {
    const callback = jest.fn();
    let topic: Topic;
    const data = {
      types: ['text/plain'],
      data: { 'text/plain': 'Hellow world' },
      files: [],
    };

    core.addEventListener('topics:insert-data', callback);

    act(() => {
      topic = createTopic(core);
    });

    insertData(core, topic.id, data);

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0].data).toEqual({
      topic,
      data,
    });
  });
});
