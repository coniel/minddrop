import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { mapById } from '@minddrop/utils';
import { getDraggedTopics } from '../getDraggedTopics';
import { setup, cleanup, core } from '../test-utils';
import { setDraggedTopics } from './setDraggedTopics';

const { tCoastalNavigation, tOffshoreNavigation } = TOPICS_TEST_DATA;

describe('setDraggedTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets dragged topics in the store', () => {
    setDraggedTopics(core, [tCoastalNavigation.id, tOffshoreNavigation.id]);

    expect(getDraggedTopics()).toEqual(
      mapById([tCoastalNavigation, tOffshoreNavigation]),
    );
  });

  it('dispatches a `app:drag:drag-topics` event', (done) => {
    core.addEventListener('app:drag:drag-topics', (payload) => {
      expect(payload.data).toEqual(
        mapById([tCoastalNavigation, tOffshoreNavigation]),
      );
      done();
    });

    setDraggedTopics(core, [tCoastalNavigation.id, tOffshoreNavigation.id]);
  });
});
