import { DROPS_TEST_DATA } from '@minddrop/drops';
import { mapById } from '@minddrop/utils';
import { getDraggedDrops } from '../getDraggedDrops';
import { setup, cleanup, core } from '../test-utils';
import { setDraggedDrops } from './setDraggedDrops';

const { textDrop1, textDrop2 } = DROPS_TEST_DATA;

describe('setDraggedDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets dragged drops in the store', () => {
    setDraggedDrops(core, [textDrop1.id, textDrop2.id]);

    expect(getDraggedDrops()).toEqual(mapById([textDrop1, textDrop2]));
  });

  it('dispatches a `app:drag-drops` event', (done) => {
    core.addEventListener('app:drag-drops', (payload) => {
      expect(payload.data).toEqual(mapById([textDrop1, textDrop2]));
      done();
    });

    setDraggedDrops(core, [textDrop1.id, textDrop2.id]);
  });
});
