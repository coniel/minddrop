import { act, renderHook } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { clearDrops } from './clearDrops';
import { useAllDrops } from '../useAllDrops';
import { Drop } from '../types';
import { createDrop } from '../createDrop';

let core = initializeCore('drops');

describe('clearDrops', () => {
  afterEach(() => {
    act(() => {
      clearDrops(core);
    });
    core = initializeCore('drops');
  });

  it('clears drops from the store', () => {
    const { result } = renderHook(() => useAllDrops());
    let drop1: Drop;
    let drop2: Drop;

    act(() => {
      drop1 = createDrop(core, { type: 'text' });
      drop2 = createDrop(core, { type: 'text' });

      clearDrops(core);
    });

    expect(result.current[drop1.id]).not.toBeDefined();
    expect(result.current[drop2.id]).not.toBeDefined();
  });

  it("dispatches a 'drops:clear' event", (done) => {
    function callback() {
      done();
    }

    core.addEventListener('drops:clear', callback);

    clearDrops(core);
  });
});
