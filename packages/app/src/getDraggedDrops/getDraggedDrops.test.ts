import { DROPS_TEST_DATA } from '@minddrop/drops';
import { mapById } from '@minddrop/utils';
import { setup, cleanup } from '../test-utils';
import { useAppStore } from '../useAppStore';
import { getDraggedDrops } from './getDraggedDrops';

const { textDrop1, textDrop2 } = DROPS_TEST_DATA;

describe('getDraggedDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns drops currently being dragged', () => {
    useAppStore
      .getState()
      .setDraggedData({ drops: [textDrop1.id, textDrop2.id] });

    expect(getDraggedDrops()).toEqual(mapById([textDrop1, textDrop2]));
  });

  it('returns `{}` if no drops are currently being dragged', () => {
    expect(getDraggedDrops()).toEqual({});
  });
});
