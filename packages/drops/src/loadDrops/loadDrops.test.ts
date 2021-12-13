import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { onDisable, onRun } from '../drops-extension';
import { loadDrops } from './loadDrops';
import { generateDrop } from '../generateDrop';

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

  it("dispatches a 'drops:load' event", () => {
    const callback = jest.fn();
    const drop1 = generateDrop({ type: 'text' });
    const drop2 = generateDrop({ type: 'text' });
    const drops = [drop1, drop2];

    core.addEventListener('drops:load', callback);

    loadDrops(core, drops);

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0].data).toEqual(drops);
  });
});
