import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { act, renderHook } from '@minddrop/test-utils';
import { mapById } from '@minddrop/utils';
import { setDraggedTopics } from '../setDraggedTopics';
import { setup, cleanup, core } from '../test-utils';
import { useDraggedTopics } from './useDraggedTopics';

const { tSailing, tAnchoring } = TOPICS_TEST_DATA;

describe('useDraggedTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns dragged topics', () => {
    const { result } = renderHook(() => useDraggedTopics());

    act(() => {
      setDraggedTopics(core, [tSailing.id, tAnchoring.id]);
    });

    expect(result.current).toEqual(mapById([tSailing, tAnchoring]));
  });

  it('returns `{}` if no topics are currently being dragged', () => {
    const { result } = renderHook(() => useDraggedTopics());

    expect(result.current).toEqual({});
  });
});
