import { act, renderHook } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { getDrops } from './getDrops';
import { DropNotFoundError } from '../errors';
import { onDisable, onRun } from '../drops-extension';
import { createDrop } from '../createDrop';
import { archiveDrop } from '../archiveDrop';
import { deleteDrop } from '../deleteDrop';
import { generateDrop } from '../generateDrop';
import { loadDrops } from '../loadDrops';

let core = initializeCore('drops');

// Set up extension
onRun(core);

describe('getDrops', () => {
  afterEach(() => {
    // Reset extension
    act(() => {
      onDisable(core);
    });
    core = initializeCore('drops');
    onRun(core);
  });

  it('returns the drops matching the ids', () => {
    const drop1 = generateDrop({ type: 'text' });
    const drop2 = generateDrop({ type: 'text' });

    act(() => {
      loadDrops(core, [drop1, drop2]);
    });

    const drops = getDrops([drop1.id, drop2.id]);

    expect(Object.keys(drops).length).toBe(2);
    expect(drops[drop1.id]).toEqual(drop1);
    expect(drops[drop2.id]).toEqual(drop2);
  });

  it('filters drops', () => {
    const drop1 = generateDrop({ type: 'text' });
    const drop2 = generateDrop({ type: 'text' });
    let drop3 = generateDrop({ type: 'text' });

    act(() => {
      loadDrops(core, [drop1, drop2, drop3]);
      archiveDrop(core, drop2.id);
      drop3 = deleteDrop(core, drop3.id);
    });

    const { result } = renderHook(() =>
      getDrops([drop1.id, drop2.id, drop3.id], { deleted: true }),
    );

    expect(result.current[drop1.id]).not.toBeDefined();
    expect(result.current[drop2.id]).not.toBeDefined();
    expect(result.current[drop3.id]).toEqual(drop3);
  });

  it('throws a DropNotFoundError if the drop does not exist', () => {
    expect(() => getDrops(['id'])).toThrowError(DropNotFoundError);
  });
});
