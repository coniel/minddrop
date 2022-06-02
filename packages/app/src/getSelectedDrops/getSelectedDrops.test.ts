import { DROPS_TEST_DATA } from '@minddrop/drops';
import { mapById } from '@minddrop/utils';
import { selectDrops } from '../selectDrops';
import { setup, cleanup, core } from '../test-utils';
import { getSelectedDrops } from './getSelectedDrops';

const { drop1, drop2 } = DROPS_TEST_DATA;

describe('getSelectedDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the currently selected drops', () => {
    selectDrops(core, [drop1.id, drop2.id]);

    expect(getSelectedDrops()).toEqual(mapById([drop1, drop2]));
  });
});
