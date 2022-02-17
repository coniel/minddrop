import { DROPS_TEST_DATA } from '@minddrop/drops';
import { mapById } from '@minddrop/utils';
import { setup, cleanup, core } from '../test-utils';
import { useAppStore } from '../useAppStore';
import { selectDrops } from './selectDrops';

const { textDrop1, textDrop2 } = DROPS_TEST_DATA;

describe('selectDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds selected drops to the store', () => {
    selectDrops(core, [textDrop1.id, textDrop2.id]);

    expect(useAppStore.getState().selectedDrops).toEqual([
      textDrop1.id,
      textDrop2.id,
    ]);
  });

  it('dispatches a `app:select-drops` event', (done) => {
    core.addEventListener('app:select-drops', (payload) => {
      expect(payload.data).toEqual(mapById([textDrop1, textDrop2]));
      done();
    });

    selectDrops(core, [textDrop1.id, textDrop2.id]);
  });
});
