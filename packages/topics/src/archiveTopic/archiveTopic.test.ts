import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { onDisable, onRun } from '../topics-extension';
import { createTopic } from '../createTopic';
import { Topic } from '../types';
import { archiveTopic } from './archiveTopic';

let core = initializeCore('topics');

// Set up extension
onRun(core);

describe('archiveTopic', () => {
  afterEach(() => {
    // Reset extension
    onDisable(core);
    core = initializeCore('topics');
    onRun(core);
  });

  it('archives the topic', () => {
    let topic: Topic;

    act(() => {
      topic = createTopic(core);
    });

    const archived = archiveTopic(core, topic.id);

    expect(archived.archived).toBe(true);
    expect(archived.archivedAt).toBeDefined();
  });

  it("dispatches a 'topics:archive' event", (done) => {
    let topic: Topic;

    function callback(payload) {
      expect(payload.data).toEqual(topic);
      done();
    }

    core.addEventListener('topics:archive', callback);

    act(() => {
      topic = createTopic(core);
    });

    topic = archiveTopic(core, topic.id);
  });
});
