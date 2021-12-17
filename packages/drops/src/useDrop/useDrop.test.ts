import { initializeCore } from '@minddrop/core';
import { renderHook, act } from '@minddrop/test-utils';
import { onDisable, onRun } from '../drops-extension';
import { generateDrop } from '../generateDrop';
import { loadDrops } from '../loadDrops';
import { useDrop } from './useDrop';

let core = initializeCore({ appId: 'app-id', extensionId: 'drops' });

// Set up extension
onRun(core);

describe('useDrop', () => {
  afterEach(() => {
    // Reset extension
    act(() => {
      onDisable(core);
    });
    core = initializeCore({ appId: 'app-id', extensionId: 'drops' });
    onRun(core);
  });

  it('returns a drop by id', () => {
    const drop = generateDrop({ type: 'text' });
    const { result } = renderHook(() => useDrop(drop.id));

    act(() => {
      loadDrops(core, [
        drop,
        generateDrop({ type: 'text' }),
        generateDrop({ type: 'text' }),
      ]);
    });

    expect(result.current).toEqual(drop);
  });

  it('returns null if drop does not exist', () => {
    const { result } = renderHook(() => useDrop('drop-id'));

    act(() => {
      loadDrops(core, [
        generateDrop({ type: 'text' }),
        generateDrop({ type: 'text' }),
      ]);
    });

    expect(result.current).toBeNull();
  });
});
