import { renderHook } from '@minddrop/test-utils';
import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { setup, cleanup, core } from '../test-utils';
import { useRootTopics } from './useRootTopics';

const { rootTopicIds } = TOPICS_TEST_DATA;

describe('useRootTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the root topics in order', () => {
    const { result } = renderHook(() => useRootTopics(core));

    expect(result.current.length).toEqual(rootTopicIds.length);
    result.current.forEach((topic, index) => {
      expect(topic.id === rootTopicIds[index]);
    });
  });
});
