import { renderHook } from '@minddrop/test-utils';
import { openTopicView } from '../openTopicView';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { useTopicTrail } from './useTopicTrail';
import { setup, cleanup, core } from '../test-utils';

const { tSailing, tNavigation, tCoastalNavigation } = TOPICS_TEST_DATA;

describe('useTopicTrail', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the currently open topic trail', () => {
    // Open a topic view
    openTopicView(core, [tSailing.id, tNavigation.id, tCoastalNavigation.id]);

    // Get the topic trail
    const { result } = renderHook(() => useTopicTrail());

    // Should return the topic trail
    expect(result.current).toEqual([
      tSailing.id,
      tNavigation.id,
      tCoastalNavigation.id,
    ]);
  });
});
