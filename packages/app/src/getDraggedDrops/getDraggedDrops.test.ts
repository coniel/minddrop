import { DROPS_TEST_DATA } from '@minddrop/drops';
import { mapById } from '@minddrop/utils';
import { setup, cleanup } from '../test-utils';
import { useAppStore } from '../useAppStore';
import { getDraggedDrops } from './getDraggedDrops';

const { drop1, drop2 } = DROPS_TEST_DATA;

describe('getDraggedDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns drops currently being dragged', () => {
    useAppStore.getState().setDraggedData({ drops: [drop1.id, drop2.id] });

    expect(getDraggedDrops()).toEqual(mapById([drop1, drop2]));
  });

  it('returns `{}` if no drops are currently being dragged', () => {
    expect(getDraggedDrops()).toEqual({});
  });
});
