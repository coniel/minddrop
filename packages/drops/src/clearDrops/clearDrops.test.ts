import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { onDisable, onRun } from '../drops-extension';
import { clearDrops } from './clearDrops';

let core = initializeCore('drops');

// Set up extension
onRun(core);

describe('loadDrops', () => {
  afterEach(() => {
    // Reset extension
    act(() => {
      onDisable(core);
    });
    core = initializeCore('drops');
    onRun(core);
  });

  it("dispatches a 'drops:clear' event", () => {
    const callback = jest.fn();

    core.addEventListener('drops:clear', callback);

    clearDrops(core);

    expect(callback).toHaveBeenCalled();
  });
});
