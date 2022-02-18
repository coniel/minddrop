import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { mapById } from '@minddrop/utils';
import { setup, cleanup, core } from '../test-utils';
import { useAppStore } from '../useAppStore';
import { selectTopics } from './selectTopics';

const { tSailing, tAnchoring } = TOPICS_TEST_DATA;

describe('selectTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds selected topics to the store', () => {
    selectTopics(core, [tSailing.id, tAnchoring.id]);

    expect(useAppStore.getState().selectedTopics).toEqual([
      tSailing.id,
      tAnchoring.id,
    ]);
  });

  it('dispatches a `app:select-topics` event', (done) => {
    core.addEventListener('app:select-topics', (payload) => {
      expect(payload.data).toEqual(mapById([tSailing, tAnchoring]));
      done();
    });

    selectTopics(core, [tSailing.id, tAnchoring.id]);
  });
});
