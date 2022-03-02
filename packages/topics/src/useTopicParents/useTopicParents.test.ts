import { useTopicParents } from './useTopicParents';
import {
  cleanup,
  core,
  setup,
  tNavigation,
  tSailing,
  tUntitled,
} from '../test-utils';
import { mapById } from '@minddrop/utils';
import { addSubtopics } from '../addSubtopics';
import { deleteTopic } from '../deleteTopic';
import { act, renderHook } from '@minddrop/test-utils';
import { Topic } from '../types';

describe('getTopicParents', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("gets a topic's parents", () => {
    let secondParent: Topic;
    const { result } = renderHook(() => useTopicParents(tNavigation.id));

    act(() => {
      // Add 'Untitled' topic as a second parent to 'Navigation' topic
      secondParent = addSubtopics(core, tUntitled.id, [tNavigation.id]);
    });

    // Should have 'Sailing' and 'Untitled' topics as parents
    expect(result.current).toEqual(mapById([tSailing, secondParent]));
  });

  it('filters results', () => {
    let secondParent: Topic;
    const { result } = renderHook(() =>
      useTopicParents(tNavigation.id, { deleted: true }),
    );

    act(() => {
      // Add 'Untitled' topic as a second parent to 'Navigation' topic
      secondParent = addSubtopics(core, tUntitled.id, [tNavigation.id]);
    });

    act(() => {
      // Delete 'Untitled' topic
      secondParent = deleteTopic(core, tUntitled.id);
    });

    // Should return only 'Untitled' topic
    expect(result.current).toEqual(mapById([secondParent]));
  });
});
