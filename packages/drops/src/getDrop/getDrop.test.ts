import { act } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { getDrop } from './getDrop';
import { DropNotFoundError } from '../errors';
import { onDisable, onRun } from '../drops-extension';
import { generateDrop } from '../generateDrop';
import { loadDrops } from '../loadDrops';

let core = initializeCore('drops');

// Set up extension
onRun(core);

describe('getDrop', () => {
  afterEach(() => {
    // Reset extension
    act(() => {
      onDisable(core);
    });
    core = initializeCore('drops');
    onRun(core);
  });

  it('returns the drop matching the id', () => {
    const drop = generateDrop({ type: 'text' });

    act(() => {
      loadDrops(core, [drop]);
    });

    expect(getDrop(drop.id)).toBe(drop);
  });

  it('throws a DropNotFoundError if the drop does not exist', () => {
    expect(() => getDrop('id')).toThrowError(DropNotFoundError);
  });
});
