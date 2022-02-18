import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { mapById } from '@minddrop/utils';
import { selectTopics } from '../selectTopics';
import { setup, cleanup, core } from '../test-utils';
import { getSelectedTopics } from './getSelectedTopics';

const { tSailing, tAnchoring } = TOPICS_TEST_DATA;

describe('getSelectedTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the currently selected topics', () => {
    selectTopics(core, [tSailing.id, tAnchoring.id]);

    expect(getSelectedTopics()).toEqual(mapById([tSailing, tAnchoring]));
  });
});
