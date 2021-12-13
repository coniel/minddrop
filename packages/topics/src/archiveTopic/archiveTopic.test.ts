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

  it("dispatches a 'topics:archive' event", () => {
    const callback = jest.fn();
    let topic: Topic;

    core.addEventListener('topics:archive', callback);

    act(() => {
      topic = createTopic(core);
    });

    const archived = archiveTopic(core, topic.id);

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0].data).toBe(archived);
  });
});
