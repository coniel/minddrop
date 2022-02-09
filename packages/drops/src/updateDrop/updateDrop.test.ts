import { act, MockDate, renderHook } from '@minddrop/test-utils';
import { updateDrop } from './updateDrop';
import { createDrop } from '../createDrop';
import { Drop } from '../types';
import { useAllDrops } from '../useAllDrops';
import { cleanup, core, setup } from '../test-utils';

describe('updateDrop', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the updated drop', () => {
    MockDate.set('01/01/2000');
    const changes = { markdown: 'Updated' };
    let drop: Drop;

    act(() => {
      drop = createDrop(core, { type: 'text' });
    });

    MockDate.set('01/02/2000');

    const updated = updateDrop(core, drop.id, changes);

    expect(updated.markdown).toBe('Updated');
    // Updates the updatedAt timestamp
    expect(updated.updatedAt.getTime()).toBe(new Date('01/02/2000').getTime());

    MockDate.reset();
  });

  it('updates the drop in the store', () => {
    const { result } = renderHook(() => useAllDrops());
    let drop: Drop;

    act(() => {
      drop = createDrop(core, { type: 'text' });
      drop = updateDrop(core, drop.id, { markdown: 'Updated' });
    });

    expect(result.current[drop.id]).toEqual(drop);
  });

  it("dispatches a 'drops:update' event", (done) => {
    MockDate.set('01/01/2000');
    const changes = { markdown: 'My drop' };
    let drop: Drop;

    function callback(payload) {
      expect(payload.data).toEqual({
        before: drop,
        after: { ...drop, ...changes, updatedAt: new Date('01/02/2000') },
        changes: { ...changes, updatedAt: new Date('01/02/2000') },
      });
      done();
    }

    core.addEventListener('drops:update', callback);

    act(() => {
      drop = createDrop(core, { type: 'text' });
      MockDate.set('01/02/2000');
      updateDrop(core, drop.id, changes);
      MockDate.reset();
    });
  });
});
