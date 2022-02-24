import { act, renderHook } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { getAllDrops } from './getAllDrops';
import { onDisable, onRun } from '../drops-extension';
import { deleteDrop } from '../deleteDrop';
import { loadDrops } from '../loadDrops';
import { generateDrop } from '../generateDrop';

let core = initializeCore({ appId: 'app-id', extensionId: 'drops' });

// Set up extension
onRun(core);

describe('getAllDrops', () => {
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

    act(() => {
      loadDrops(core, [drop1, drop2, drop3]);
    });

    const drops = getAllDrops();

    expect(Object.keys(drops).length).toBe(3);
    expect(drops[drop1.id]).toBe(drop1);
    expect(drops[drop2.id]).toBe(drop2);
    expect(drops[drop3.id]).toBe(drop3);
  });

  it('filters drops', () => {
    const drop1 = generateDrop({ type: 'text' });
    const drop2 = generateDrop({ type: 'text' });
    let drop3 = generateDrop({ type: 'text' });

    act(() => {
      loadDrops(core, [drop1, drop2, drop3]);
      drop3 = deleteDrop(core, drop3.id);
    });

    const { result } = renderHook(() => getAllDrops({ deleted: true }));

    expect(result.current[drop1.id]).not.toBeDefined();
    expect(result.current[drop2.id]).not.toBeDefined();
    expect(result.current[drop3.id]).toEqual(drop3);
  });
});
