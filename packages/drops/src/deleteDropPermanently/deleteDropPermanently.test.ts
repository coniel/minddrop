import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { onDisable, onRun } from '../drops-extension';
import { deleteDropPermanently } from './deleteDropPermanently';
import { generateDrop } from '../generateDrop';
import { loadDrops } from '../loadDrops';

let core = initializeCore('drops');

// Set up extension
onRun(core);

describe('deleteDrop', () => {
  afterEach(() => {
    // Reset extension
    act(() => {
      onDisable(core);
    });
    core = initializeCore('drops');
    onRun(core);
  });

  it("dispatches a 'drops:delete-permanently' event", () => {
    const callback = jest.fn();
    const drop = generateDrop({ type: 'text' });

    core.addEventListener('drops:delete-permanently', callback);

    act(() => {
      loadDrops(core, [drop]);
    });

    deleteDropPermanently(core, drop.id);

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0].data).toBe(drop);
  });
});
