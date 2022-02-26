import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { setup, cleanup } from '../test-utils';
import { getRootTopics } from './getRootTopics';

const { rootTopicIds } = TOPICS_TEST_DATA;

describe('getRootTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the root topics in order', () => {
    const rootTopics = getRootTopics();

    expect(rootTopics.length).toEqual(rootTopicIds.length);
    rootTopics.forEach((topic, index) => {
      expect(topic.id === rootTopicIds[index]);
    });
  });
});
