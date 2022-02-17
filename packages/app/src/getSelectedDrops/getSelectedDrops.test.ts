import { DROPS_TEST_DATA } from '@minddrop/drops';
import { mapById } from '@minddrop/utils';
import { selectDrops } from '../selectDrops';
import { setup, cleanup, core } from '../test-utils';
import { getSelectedDrops } from './getSelectedDrops';

const { textDrop1, textDrop2 } = DROPS_TEST_DATA;

describe('getSelectedDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the currently selected drops', () => {
    selectDrops(core, [textDrop1.id, textDrop2.id]);

    expect(getSelectedDrops()).toEqual(mapById([textDrop1, textDrop2]));
  });
});
