import { act, renderHook } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { loadDrops } from './loadDrops';
import { generateDrop } from '../generateDrop';
import { useAllDrops } from '../useAllDrops';
import { clearDrops } from '../clearDrops';

let core = initializeCore({ appId: 'app-id', extensionId: 'drops' });

describe('loadDrops', () => {
  afterEach(() => {
    act(() => {
      clearDrops(core);
    });
    core = initializeCore({ appId: 'app-id', extensionId: 'drops' });
  });

  it('loads drops into the store', () => {
    const { result } = renderHook(() => useAllDrops());
    const drop1 = generateDrop({ type: 'text' });
    const drop2 = generateDrop({ type: 'text' });

    act(() => {
      loadDrops(core, [drop1, drop2]);
    });

    expect(result.current[drop1.id]).toEqual(drop1);
    expect(result.current[drop2.id]).toEqual(drop2);
  });

  it("dispatches a 'drops:load' event", (done) => {
    const drop1 = generateDrop({ type: 'text' });
    const drop2 = generateDrop({ type: 'text' });
    const drops = [drop1, drop2];

    function callback(payload) {
      expect(payload.data).toEqual(drops);
      done();
    }

    core.addEventListener('drops:load', callback);

    act(() => {
      loadDrops(core, drops);
    });
  });
});
