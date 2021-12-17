import { initializeCore } from '@minddrop/core';
import { act } from '@minddrop/test-utils';
import { deleteDrop } from './deleteDrop';
import { Drop } from '../types';
import { createDrop } from '../createDrop';
import { clearDrops } from '../clearDrops';

let core = initializeCore({ appId: 'app-id', extensionId: 'drops' });

describe('deleteDrop', () => {
  afterEach(() => {
    act(() => {
      clearDrops(core);
    });
    core = initializeCore({ appId: 'app-id', extensionId: 'drops' });
  });

  it('deletes the drop', () => {
    let drop: Drop;

    act(() => {
      drop = createDrop(core, { type: 'text' });
      drop = deleteDrop(core, drop.id);
    });

    expect(drop.deleted).toBe(true);
    expect(drop.deletedAt).toBeDefined();
  });

  it("dispatches a 'drops:delete' event", (done) => {
    let drop: Drop;

    function callback(payload) {
      expect(payload.data).toEqual(drop);
      done();
    }

    core.addEventListener('drops:delete', callback);

    act(() => {
      drop = createDrop(core, { type: 'text' });
      drop = deleteDrop(core, drop.id);
    });
  });
});
