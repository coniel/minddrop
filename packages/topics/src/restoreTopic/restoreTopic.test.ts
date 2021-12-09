import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { onDisable, onRun } from '../topics-extension';
import { createTopic } from '../createTopic';
import { Topic } from '../types';
import { restoreTopic } from './restoreTopic';
import { archiveTopic } from '../archiveTopic';
import { deleteTopic } from '../deleteTopic';

let core = initializeCore('topics');

// Set up extension
onRun(core);

describe('unarchiveTopic', () => {
  afterEach(() => {
    // Reset extension
    onDisable(core);
    core = initializeCore('topics');
    onRun(core);
  });

  it('restores archived topics', () => {
    let topic: Topic;

    act(() => {
      topic = createTopic(core);
      archiveTopic(core, topic.id);
    });

    const restored = restoreTopic(core, topic.id);

    expect(restored.archived).not.toBeDefined();
    expect(restored.archivedAt).not.toBeDefined();
  });

  it('restores deleted topics', () => {
    let topic: Topic;

    act(() => {
      topic = createTopic(core);
      deleteTopic(core, topic.id);
    });

    const restored = restoreTopic(core, topic.id);

    expect(restored.deleted).not.toBeDefined();
    expect(restored.deletedAt).not.toBeDefined();
  });

  it("dispatches a 'topics:restore' event", () => {
    const callback = jest.fn();
    let topic: Topic;

    core.addEventListener('topics:restore', callback);

    act(() => {
      topic = createTopic(core);
    });

    const restored = restoreTopic(core, topic.id);

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0].data).toBe(restored);
  });
});
