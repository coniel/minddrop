import { DROPS_TEST_DATA } from '@minddrop/drops';
import { act, renderHook } from '@minddrop/test-utils';
import { mapById } from '@minddrop/utils';
import { setDraggedDrops } from '../setDraggedDrops';
import { setup, cleanup, core } from '../test-utils';
import { useDraggedDrops } from './useDraggedDrops';

const { textDrop1, textDrop2 } = DROPS_TEST_DATA;

describe('useDraggedDrops', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns dragged drops', () => {
    const { result } = renderHook(() => useDraggedDrops());

    act(() => {
      setDraggedDrops(core, [textDrop1.id, textDrop2.id]);
    });

    expect(result.current).toEqual(mapById([textDrop1, textDrop2]));
  });

  it('returns `{}` if no drops are currently being dragged', () => {
    const { result } = renderHook(() => useDraggedDrops());

    expect(result.current).toEqual({});
  });
});
