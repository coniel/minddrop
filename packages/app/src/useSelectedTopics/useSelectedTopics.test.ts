import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { act, renderHook } from '@minddrop/test-utils';
import { mapById } from '@minddrop/utils';
import { selectTopics } from '../selectTopics';
import { setup, cleanup, core } from '../test-utils';
import { useSelectedTopics } from './useSelectedTopics';

const { tSailing, tAnchoring } = TOPICS_TEST_DATA;

describe('useSelectedTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the currently selected topics', () => {
    const { result } = renderHook(() => useSelectedTopics());

    act(() => {
      selectTopics(core, [tSailing.id, tAnchoring.id]);
    });

    expect(result.current).toEqual(mapById([tSailing, tAnchoring]));
  });

  it('returns {} if no topics are selected', () => {
    const { result } = renderHook(() => useSelectedTopics());

    expect(result.current).toEqual({});
  });
});
