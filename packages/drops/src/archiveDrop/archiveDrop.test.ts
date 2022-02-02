import { act } from '@minddrop/test-utils';
import { archiveDrop } from './archiveDrop';
import { generateDrop } from '../generateDrop';
import { loadDrops } from '../loadDrops';
import { Drop } from '../types';
import { createDrop } from '../createDrop';
import { cleanup, core, initialize } from '../tests';

describe('archiveDrop', () => {
  beforeEach(() => {
    initialize();
  });

  afterEach(() => {
    cleanup();
  });

  it('archives the drop', () => {
    const drop = generateDrop({ type: 'text' });

    act(() => {
      loadDrops(core, [drop]);
    });

    const archived = archiveDrop(core, drop.id);

    expect(archived.archived).toBe(true);
    expect(archived.archivedAt).toBeDefined();
  });

  it("dispatches a 'drops:archive' event", (done) => {
    let drop: Drop;

    function callback(payload) {
      expect(payload.data).toEqual(drop);
      done();
    }

    core.addEventListener('drops:archive', callback);

    act(() => {
      drop = createDrop(core, { type: 'text' });
      drop = archiveDrop(core, drop.id);
    });
  });
});
