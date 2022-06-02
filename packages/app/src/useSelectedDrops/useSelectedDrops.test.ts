import { DROPS_TEST_DATA } from '@minddrop/drops';
import { act, renderHook } from '@minddrop/test-utils';
import { mapById } from '@minddrop/utils';
import { selectDrops } from '../selectDrops';
import { setup, cleanup, core } from '../test-utils';
import { useSelectedDrops } from './useSelectedDrops';

const { drop1, drop2 } = DROPS_TEST_DATA;

describe('useSelectedDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the currently selected drops', () => {
    const { result } = renderHook(() => useSelectedDrops());

    act(() => {
      selectDrops(core, [drop1.id, drop2.id]);
    });

    expect(result.current).toEqual(mapById([drop1, drop2]));
  });

  it('returns {} if no drops are selected', () => {
    const { result } = renderHook(() => useSelectedDrops());

    expect(result.current).toEqual({});
  });
});
