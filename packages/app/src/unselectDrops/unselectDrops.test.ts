import { DROPS_TEST_DATA } from '@minddrop/drops';
import { mapById } from '@minddrop/utils';
import { selectDrops } from '../selectDrops';
import { setup, cleanup, core } from '../test-utils';
import { useAppStore } from '../useAppStore';
import { unselectDrops } from './unselectDrops';

const { drop1, drop2, drop3 } = DROPS_TEST_DATA;

describe('unselectDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes selected drops from the store', () => {
    selectDrops(core, [drop1.id, drop2.id, drop3.id]);
    unselectDrops(core, [drop1.id, drop2.id]);

    expect(useAppStore.getState().selectedDrops).toEqual([drop3.id]);
  });

  it('dispatches a `app:selection:unselect-drops` event', (done) => {
    selectDrops(core, [drop1.id, drop2.id, drop3.id]);

    core.addEventListener('app:selection:unselect-drops', (payload) => {
      expect(payload.data).toEqual(mapById([drop1, drop2]));
      done();
    });

    unselectDrops(core, [drop1.id, drop2.id]);
  });
});
