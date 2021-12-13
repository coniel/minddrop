import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { onDisable, onRun } from '../topics-extension';
import { insertData } from './insertData';
import { Topic } from '../types';
import { createTopic } from '../createTopic';

let core = initializeCore('topics');

// Set up extension
onRun(core);

describe('insertData', () => {
  afterEach(() => {
    // Reset extension
    onDisable(core);
    core = initializeCore('topics');
    onRun(core);
  });

  it("dispatches a 'topics:inert-data' event", (done) => {
    let topic: Topic;
    const data = {
      types: ['text/plain'],
      data: { 'text/plain': 'Hellow world' },
      files: [],
    };

    function callback(payload) {
      expect(payload.data.data).toBe(data);
      expect(payload.data.topic).toBe(topic);
      done();
    }

    core.addEventListener('topics:insert-data', callback);

    act(() => {
      topic = createTopic(core);
    });

    insertData(core, topic.id, data);
  });
});
