import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { onDisable, onRun } from '../drops-extension';
import { deleteDrop } from './deleteDrop';
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

  it('deletes the drop', () => {
    const drop = generateDrop({ type: 'text' });

    act(() => {
      loadDrops(core, [drop]);
    });

    const deleted = deleteDrop(core, drop.id);

    expect(deleted.deleted).toBe(true);
    expect(deleted.deletedAt).toBeDefined();
  });

  it("dispatches a 'drops:delete' event", () => {
    const callback = jest.fn();
    const drop = generateDrop({ type: 'text' });

    core.addEventListener('drops:delete', callback);

    act(() => {
      loadDrops(core, [drop]);
    });

    const deleted = deleteDrop(core, drop.id);

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0].data).toBe(deleted);
  });
});
