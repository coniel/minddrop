import { act, renderHook } from '@minddrop/test-utils';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { setup, cleanup, tSailingExtensions } from '../test-utils';
import { useTopicExtensions } from './useTopicExtensions';

const { tSailing } = TOPICS_TEST_DATA;

describe('useTopicExtensions', () => {
  beforeEach(setup);

  afterEach(() => {
    act(() => {
      cleanup();
    });
  });

  it('returns extensions enabled on a topic', () => {
    // Get a topic's extensions
    const { result } = renderHook(() => useTopicExtensions(tSailing.id));

    // Should return the topic's enabled extensions
    expect(result.current).toEqual(tSailingExtensions);
  });
});
