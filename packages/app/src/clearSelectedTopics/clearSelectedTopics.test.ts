import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { selectTopics } from '../selectTopics';
import { setup, cleanup, core } from '../test-utils';
import { useAppStore } from '../useAppStore';
import { clearSelectedTopics } from './clearSelectedTopics';

const { tSailing, tAnchoring } = TOPICS_TEST_DATA;

describe('clearSelectedTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('clears selected topics', () => {
    selectTopics(core, [tSailing.id, tAnchoring.id]);
    clearSelectedTopics(core);

    expect(useAppStore.getState().selectedTopics).toEqual([]);
  });

  it('dispatches a `app:selected-topics:clear` event', (done) => {
    selectTopics(core, [tSailing.id, tAnchoring.id]);

    core.addEventListener('app:selected-topics:clear', () => {
      done();
    });

    clearSelectedTopics(core);
  });
});
