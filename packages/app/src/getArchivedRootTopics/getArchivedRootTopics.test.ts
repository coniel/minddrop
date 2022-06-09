import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { setup, cleanup, core } from '../test-utils';
import { archiveRootTopics } from '../archiveRootTopics';
import { getArchivedRootTopics } from './getArchivedRootTopics';

const { tSailing, tNavigation } = TOPICS_TEST_DATA;

describe('getArchivedRootTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns archived root topics', () => {
    // Archive some topics
    archiveRootTopics(core, [tSailing.id, tNavigation.id]);

    // Should return archived topics
    expect(getArchivedRootTopics()).toEqual([tSailing, tNavigation]);
  });
});
