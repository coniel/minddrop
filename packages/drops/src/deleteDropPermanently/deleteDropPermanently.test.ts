import { act, renderHook } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { deleteDropPermanently } from './deleteDropPermanently';
import { clearDrops } from '../clearDrops';
import { Drop } from '../types';
import { createDrop } from '../createDrop';
import { useAllDrops } from '../useAllDrops';

let core = initializeCore('drops');

describe('deleteDrop', () => {
  afterEach(() => {
    act(() => {
      clearDrops(core);
    });
    core = initializeCore('drops');
  });

  it("reacts to 'drops:delete-permanently' events by removing the drop from the store", () => {
    const { result } = renderHook(() => useAllDrops());
    let drop: Drop;

    act(() => {
      drop = createDrop(core, { type: 'text' });
      deleteDropPermanently(core, drop.id);
    });

    expect(result.current[drop.id]).not.toBeDefined();
  });

  it("dispatches a 'drops:delete-permanently' event", () => {
    let drop: Drop;

    function callback(payload) {
      expect(payload.data).toEqual(drop);
    }

    core.addEventListener('drops:delete-permanently', callback);

    act(() => {
      drop = createDrop(core, { type: 'text' });
      deleteDropPermanently(core, drop.id);
    });
  });
});
