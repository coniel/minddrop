import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { setup, cleanup, core } from '../test-utils';
import { archiveRootTopics } from '../archiveRootTopics';
import { useArchivedRootTopics } from './useArchivedRootTopics';
import { act, renderHook } from '@minddrop/test-utils';

const { tSailing, tNavigation } = TOPICS_TEST_DATA;

describe('useArchivedRootTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns archived root topics', () => {
    const { result } = renderHook(() => useArchivedRootTopics());

    act(() => {
      // Archive some topics
      archiveRootTopics(core, [tSailing.id, tNavigation.id]);
    });

    // Should return archived topics
    expect(result.current).toEqual([tSailing, tNavigation]);
  });
});
