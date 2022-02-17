import { DROPS_TEST_DATA } from '@minddrop/drops';
import { selectDrops } from '../selectDrops';
import { setup, cleanup, core } from '../test-utils';
import { useAppStore } from '../useAppStore';
import { clearSelectedDrops } from './clearSelectedDrops';

const { textDrop1, textDrop2 } = DROPS_TEST_DATA;

describe('clearSelectedDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('clears selected drops', () => {
    selectDrops(core, [textDrop1.id, textDrop2.id]);
    clearSelectedDrops(core);

    expect(useAppStore.getState().selectedDrops).toEqual([]);
  });

  it('dispatches a `app:clear-selected-drops` event', (done) => {
    selectDrops(core, [textDrop1.id, textDrop2.id]);

    core.addEventListener('app:clear-selected-drops', () => {
      done();
    });

    clearSelectedDrops(core);
  });
});
