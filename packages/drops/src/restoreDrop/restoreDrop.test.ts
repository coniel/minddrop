import { act } from '@minddrop/test-utils';
import { createDrop } from '../createDrop';
import { Drop } from '../types';
import { restoreDrop } from './restoreDrop';
import { deleteDrop } from '../deleteDrop';
import { cleanup, core, setup } from '../test-utils';

describe('restoreDrop', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('restores deleted drops', () => {
    let drop: Drop;

    act(() => {
      drop = createDrop(core, { type: 'text' });
      deleteDrop(core, drop.id);
    });

    const restored = restoreDrop(core, drop.id);

    expect(restored.deleted).not.toBeDefined();
    expect(restored.deletedAt).not.toBeDefined();
  });

  it("dispatches a 'drops:restore' event", (done) => {
    let drop: Drop;

    function callback(payload) {
      expect(payload.data).toEqual(drop);
      done();
    }

    core.addEventListener('drops:restore', callback);

    act(() => {
      drop = createDrop(core, { type: 'text' });
      drop = restoreDrop(core, drop.id);
    });
  });
});
