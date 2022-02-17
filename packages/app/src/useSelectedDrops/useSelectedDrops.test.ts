import { DROPS_TEST_DATA } from '@minddrop/drops';
import { act, renderHook } from '@minddrop/test-utils';
import { mapById } from '@minddrop/utils';
import { selectDrops } from '../selectDrops';
import { setup, cleanup, core } from '../test-utils';
import { useSelectedDrops } from './useSelectedDrops';

const { textDrop1, textDrop2 } = DROPS_TEST_DATA;

describe('useSelectedDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the currently selected drops', () => {
    const { result } = renderHook(() => useSelectedDrops());

    act(() => {
      selectDrops(core, [textDrop1.id, textDrop2.id]);
    });

    expect(result.current).toEqual(mapById([textDrop1, textDrop2]));
  });
});
