import { initializeCore } from '@minddrop/core';
import { onDisable, onRun } from '../extension';
import { loadTopics } from './loadTopics';
import { generateTopic } from '../generateTopic';

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
    const topic1 = generateTopic();
    const topic2 = generateTopic();
    const topics = [topic1, topic2];

    core.addEventListener('topics:load', callback);

    loadTopics(core, topics);

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0].data).toEqual(topics);
  });
});
