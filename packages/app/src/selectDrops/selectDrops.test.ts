import { DROPS_TEST_DATA } from '@minddrop/drops';
import { mapById } from '@minddrop/utils';
import { setup, cleanup, core } from '../test-utils';
import { useAppStore } from '../useAppStore';
import { selectDrops } from './selectDrops';

const { drop1, drop2 } = DROPS_TEST_DATA;

describe('selectDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds selected drops to the store', () => {
    selectDrops(core, [drop1.id, drop2.id]);

    expect(useAppStore.getState().selectedDrops).toEqual([drop1.id, drop2.id]);
  });

  it('dispatches a `app:selection:select-drops` event', (done) => {
    core.addEventListener('app:selection:select-drops', (payload) => {
      expect(payload.data).toEqual(mapById([drop1, drop2]));
      done();
    });

    selectDrops(core, [drop1.id, drop2.id]);
  });
});
