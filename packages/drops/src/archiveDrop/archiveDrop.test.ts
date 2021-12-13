import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { onDisable, onRun } from '../drops-extension';
import { archiveDrop } from './archiveDrop';
import { generateDrop } from '../generateDrop';
import { loadDrops } from '../loadDrops';

let core = initializeCore('drops');

// Set up extension
onRun(core);

describe('archiveDrop', () => {
  afterEach(() => {
    // Reset extension
    act(() => {
      onDisable(core);
    });
    core = initializeCore('drops');
    onRun(core);
  });

  it('archives the drop', () => {
    const drop = generateDrop({ type: 'text' });

    act(() => {
      loadDrops(core, [drop]);
    });

    const archived = archiveDrop(core, drop.id);

    expect(archived.archived).toBe(true);
    expect(archived.archivedAt).toBeDefined();
  });

  it("dispatches a 'drops:archive' event", () => {
    const callback = jest.fn();
    const drop = generateDrop({ type: 'text' });

    core.addEventListener('drops:archive', callback);

    act(() => {
      loadDrops(core, [drop]);
    });

    const archived = archiveDrop(core, drop.id);

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0].data).toBe(archived);
  });
});
