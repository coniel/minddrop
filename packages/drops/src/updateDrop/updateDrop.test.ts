import { act, MockDate } from '@minddrop/test-utils';
import { initializeCore } from '@minddrop/core';
import { updateDrop } from './updateDrop';
import { onDisable, onRun } from '../drops-extension';
import { generateDrop } from '../generateDrop';
import { loadDrops } from '../loadDrops';

let core = initializeCore('drops');

// Set up extension
onRun(core);

describe('updateDrop', () => {
  afterEach(() => {
    // Reset extension
    act(() => {
      onDisable(core);
    });
    core = initializeCore('drops');
    onRun(core);
  });

  it('returns the updated drop', () => {
    MockDate.set('01/01/2000');
    const changes = { markdown: 'Updated' };
    const drop = generateDrop({ type: 'text' });

    act(() => {
      loadDrops(core, [drop]);
    });

    MockDate.set('01/02/2000');

    const updated = updateDrop(core, drop.id, changes);

    expect(updated.markdown).toBe('Updated');
    // Updates the updatedAt timestamp
    expect(updated.updatedAt.getTime()).toBe(new Date('01/02/2000').getTime());

    MockDate.reset();
  });

  it("dispatches a 'drops:update' event", () => {
    MockDate.set('01/01/2000');
    const callback = jest.fn();
    const changes = { markdown: 'Updated' };
    const drop = generateDrop({ type: 'text' });

    act(() => {
      loadDrops(core, [drop]);
    });

    core.addEventListener('drops:update', callback);

    MockDate.set('01/02/2000');

    updateDrop(core, drop.id, changes);

    expect(callback).toHaveBeenCalledWith({
      source: 'drops',
      type: 'drops:update',
      data: {
        before: drop,
        after: { ...drop, ...changes, updatedAt: new Date('01/02/2000') },
        changes: { ...changes, updatedAt: new Date('01/02/2000') },
      },
    });

    MockDate.reset();
  });
});
