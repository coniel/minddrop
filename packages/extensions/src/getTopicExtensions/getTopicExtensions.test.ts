import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { setup, cleanup, tSailingExtensions } from '../test-utils';
import { getTopicExtensions } from './getTopicExtensions';

const { tSailing } = TOPICS_TEST_DATA;

describe('getTopicExtensions', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the enabled extensions for a topic', () => {
    const topicExtensions = getTopicExtensions(tSailing.id);

    expect(topicExtensions).toEqual(tSailingExtensions);
  });
});
