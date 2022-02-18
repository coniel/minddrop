import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { mapById } from '@minddrop/utils';
import { selectTopics } from '../selectTopics';
import { setup, cleanup, core } from '../test-utils';
import { useAppStore } from '../useAppStore';
import { unselectTopics } from './unselectTopics';

const { tSailing, tAnchoring, tBoats } = TOPICS_TEST_DATA;

describe('selectTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes selected topics from the store', () => {
    selectTopics(core, [tSailing.id, tAnchoring.id, tBoats.id]);
    unselectTopics(core, [tSailing.id, tAnchoring.id]);

    expect(useAppStore.getState().selectedTopics).toEqual([tBoats.id]);
  });

  it('dispatches a `app:unselect-topics` event', (done) => {
    selectTopics(core, [tSailing.id, tAnchoring.id, tBoats.id]);

    core.addEventListener('app:unselect-topics', (payload) => {
      expect(payload.data).toEqual(mapById([tSailing, tAnchoring]));
      done();
    });

    unselectTopics(core, [tSailing.id, tAnchoring.id]);
  });
});
