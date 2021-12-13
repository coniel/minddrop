import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { onDisable, onRun } from '../drops-extension';
import { createDrop } from '../createDrop';
import { Drop } from '../types';
import { restoreDrop } from './restoreDrop';
import { archiveDrop } from '../archiveDrop';
import { deleteDrop } from '../deleteDrop';

let core = initializeCore('drops');

// Set up extension
onRun(core);

describe('restoreDrop', () => {
  afterEach(() => {
    // Reset extension
    act(() => {
      onDisable(core);
    });
    core = initializeCore('drops');
    onRun(core);
  });

  it('restores archived drops', () => {
    let drop: Drop;

    act(() => {
      drop = createDrop(core, { type: 'text' });
      archiveDrop(core, drop.id);
    });

    const restored = restoreDrop(core, drop.id);

    expect(restored.archived).not.toBeDefined();
    expect(restored.archivedAt).not.toBeDefined();
  });

  it('restores deleted drops', () => {
    let drop: Drop;

    act(() => {
      drop = createDrop(core, { type: 'text' });
      deleteDrop(core, drop.id);
    });

    const restored = restoreDrop(core, drop.id);

    expect(restored.deleted).not.toBeDefined();
    expect(restored.deletedAt).not.toBeDefined();
  });

  it("dispatches a 'drops:restore' event", () => {
    const callback = jest.fn();
    let drop: Drop;

    core.addEventListener('drops:restore', callback);

    act(() => {
      drop = createDrop(core, { type: 'text' });
    });

    const restored = restoreDrop(core, drop.id);

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0].data).toBe(restored);
  });
});
