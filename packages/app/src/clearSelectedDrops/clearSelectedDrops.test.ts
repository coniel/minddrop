import { DROPS_TEST_DATA } from '@minddrop/drops';
import { selectDrops } from '../selectDrops';
import { setup, cleanup, core } from '../test-utils';
import { useAppStore } from '../useAppStore';
import { clearSelectedDrops } from './clearSelectedDrops';

const { drop1, drop2 } = DROPS_TEST_DATA;

describe('clearSelectedDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('clears selected drops', () => {
    selectDrops(core, [drop1.id, drop2.id]);
    clearSelectedDrops(core);

    expect(useAppStore.getState().selectedDrops).toEqual([]);
  });

  it('dispatches a `app:selected-drops:clear` event', (done) => {
    selectDrops(core, [drop1.id, drop2.id]);

    core.addEventListener('app:selected-drops:clear', () => {
      done();
    });

    clearSelectedDrops(core);
  });
});
