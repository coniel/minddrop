import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { mapById } from '@minddrop/utils';
import { setup, cleanup } from '../test-utils';
import { useAppStore } from '../useAppStore';
import { getDraggedTopics } from './getDraggedTopics';

const { tCoastalNavigation, tOffshoreNavigation } = TOPICS_TEST_DATA;

describe('getDraggedTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns topics currently being dragged', () => {
    useAppStore.getState().setDraggedData({
      topics: [tCoastalNavigation.id, tOffshoreNavigation.id],
    });

    expect(getDraggedTopics()).toEqual(
      mapById([tCoastalNavigation, tOffshoreNavigation]),
    );
  });

  it('returns `{}` if no topics are currently being dragged', () => {
    expect(getDraggedTopics()).toEqual({});
  });
});
