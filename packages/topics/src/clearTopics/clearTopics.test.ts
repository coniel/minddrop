import { initializeCore } from '@minddrop/core';
import { onDisable, onRun } from '../topics-extension';
import { clearTopics } from './clearTopics';

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

  it("dispatches a 'topics:clear' event", () => {
    const callback = jest.fn();

    core.addEventListener('topics:clear', callback);

    clearTopics(core);

    expect(callback).toHaveBeenCalled();
  });
});
