import { DROPS_TEST_DATA } from '@minddrop/drops';
import { mapById } from '@minddrop/utils';
import { getDraggedDrops } from '../getDraggedDrops';
import { setup, cleanup, core } from '../test-utils';
import { setDraggedDrops } from './setDraggedDrops';

const { drop1, drop2 } = DROPS_TEST_DATA;

describe('setDraggedDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets dragged drops in the store', () => {
    setDraggedDrops(core, [drop1.id, drop2.id]);

    expect(getDraggedDrops()).toEqual(mapById([drop1, drop2]));
  });

  it('dispatches a `app:drag:drag-drops` event', (done) => {
    core.addEventListener('app:drag:drag-drops', (payload) => {
      expect(payload.data).toEqual(mapById([drop1, drop2]));
      done();
    });

    setDraggedDrops(core, [drop1.id, drop2.id]);
  });
});
