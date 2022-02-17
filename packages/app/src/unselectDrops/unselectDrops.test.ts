import { DROPS_TEST_DATA } from '@minddrop/drops';
import { mapById } from '@minddrop/utils';
import { selectDrops } from '../selectDrops';
import { setup, cleanup, core } from '../test-utils';
import { useAppStore } from '../useAppStore';
import { unselectDrops } from './unselectDrops';

const { textDrop1, textDrop2, textDrop3 } = DROPS_TEST_DATA;

describe('selectDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes selected drops from the store', () => {
    selectDrops(core, [textDrop1.id, textDrop2.id, textDrop3.id]);
    unselectDrops(core, [textDrop1.id, textDrop2.id]);

    expect(useAppStore.getState().selectedDrops).toEqual([textDrop3.id]);
  });

  it('dispatches a `app:unselect-drops` event', (done) => {
    selectDrops(core, [textDrop1.id, textDrop2.id, textDrop3.id]);

    core.addEventListener('app:unselect-drops', (payload) => {
      expect(payload.data).toEqual(mapById([textDrop1, textDrop2]));
      done();
    });

    unselectDrops(core, [textDrop1.id, textDrop2.id]);
  });
});
