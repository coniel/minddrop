import { initializeCore } from '@minddrop/core';
import { renderHook, act } from '@minddrop/test-utils';
import { onDisable, onRun } from '../drops-extension';
import { generateDrop } from '../generateDrop';
import { loadDrops } from '../loadDrops';
import { useDropsStore } from '../useDropsStore';
import { useAllDrops } from './useAllDrops';

let core = initializeCore({ appId: 'app-id', extensionId: 'drops' });

// Set up extension
onRun(core);

describe('useAllDrops', () => {
  afterEach(() => {
    // Reset extension
    act(() => {
      onDisable(core);
    });
    core = initializeCore({ appId: 'app-id', extensionId: 'drops' });
    onRun(core);
  });

  it('returns all drops', () => {
    const drop1 = generateDrop({ type: 'text' });
    const drop2 = generateDrop({ type: 'text' });
    const drop3 = generateDrop({ type: 'text' });

    const { result } = renderHook(() => useAllDrops());

    act(() => {
      loadDrops(core, [drop1, drop2, drop3]);
    });

    expect(result.current[drop1.id]).toEqual(drop1);
    expect(result.current[drop2.id]).toEqual(drop2);
    expect(result.current[drop3.id]).toEqual(drop3);
  });

  it('filters drops', () => {
    const { result: store } = renderHook(() => useDropsStore((state) => state));
    const drop1 = generateDrop({ type: 'text' });
    const drop2 = {
      ...generateDrop({ type: 'text' }),
      archived: true,
      archivedAt: new Date(),
    };
    const drop3 = {
      ...generateDrop({ type: 'text' }),
      deleted: true,
      deletedAt: new Date(),
    };
    const { result } = renderHook(() => useAllDrops({ deleted: true }));

    act(() => {
      store.current.loadDrops([drop1, drop2, drop3]);
    });

    expect(result.current[drop1.id]).not.toBeDefined();
    expect(result.current[drop2.id]).not.toBeDefined();
    expect(result.current[drop3.id]).toEqual(drop3);
  });
});
