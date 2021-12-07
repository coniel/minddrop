import { initializeCore } from '@minddrop/core';
import { onDisable, onRun } from '../extension';
import { clearTags } from './clearTags';

let core = initializeCore('tags');

// Set up extension
onRun(core);

describe('loadTags', () => {
  afterEach(() => {
    // Reset extension
    onDisable(core);
    core = initializeCore('tags');
    onRun(core);
  });

  it("dispatches a 'tags:clear' event", () => {
    const callback = jest.fn();

    core.addEventListener('tags:clear', callback);

    clearTags(core);

    expect(callback).toHaveBeenCalled();
  });
});
