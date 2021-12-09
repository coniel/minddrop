import { initializeCore } from '@minddrop/core';
import { renderHook, act } from '@minddrop/test-utils';
import { archiveDrop } from '../archiveDrop';
import { deleteDrop } from '../deleteDrop';
import { onDisable, onRun } from '../drops-extension';
import { generateDrop } from '../generateDrop';
import { loadDrops } from '../loadDrops';
import { useDrops } from './useDrops';

let core = initializeCore('drops');

// Set up extension
onRun(core);

describe('useDrops', () => {
  afterEach(() => {
    // Reset extension
    act(() => {
      onDisable(core);
    });
    core = initializeCore('drops');
    onRun(core);
  });

  it('returns drops by id', () => {
    const drop1 = generateDrop({ type: 'text' });
    const drop2 = generateDrop({ type: 'text' });
    const drop3 = generateDrop({ type: 'text' });
    const { result } = renderHook(() => useDrops([drop1.id, drop2.id]));

    act(() => {
      loadDrops(core, [drop1, drop2, drop3]);
    });

    expect(result.current[drop1.id]).toEqual(drop1);
    expect(result.current[drop2.id]).toEqual(drop2);
    expect(result.current[drop3.id]).not.toBeDefined();
  });

  it('ignores non existant drops', () => {
    const drop1 = generateDrop({ type: 'text' });
    const drop2 = generateDrop({ type: 'text' });
    const { result } = renderHook(() => useDrops([drop1.id, 'missing-drop']));

    act(() => {
      loadDrops(core, [drop1, drop2]);
    });

    expect(result.current['missing-drop']).not.toBeDefined();
    expect(Object.keys(result.current).length).toBe(1);
  });

  it('filters drops', () => {
    const drop1 = generateDrop({ type: 'text' });
    const drop2 = generateDrop({ type: 'text' });
    let drop3 = generateDrop({ type: 'text' });

    const { result } = renderHook(() =>
      useDrops([drop1.id, drop2.id, drop3.id], { deleted: true }),
    );

    act(() => {
      loadDrops(core, [drop1, drop2, drop3]);
      archiveDrop(core, drop2.id);
      drop3 = deleteDrop(core, drop3.id);
    });

    expect(result.current[drop1.id]).not.toBeDefined();
    expect(result.current[drop2.id]).not.toBeDefined();
    expect(result.current[drop3.id]).toEqual(drop3);
  });
});
