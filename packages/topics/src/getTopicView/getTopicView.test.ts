import { TopicViewNotRegisteredError } from '../errors';
import { cleanup, setup, topicViewColumns } from '../test-utils';
import { getTopicView } from './getTopicView';

describe('getTopicView', () => {
  beforeAll(setup);

  afterEach(cleanup);

  it('returns the topic view', () => {
    expect(getTopicView(topicViewColumns.id)).toEqual(topicViewColumns);
  });

  it('throws a TopicViewNotRegisteredError if the view is not registered', () => {
    expect(() => getTopicView('unregistered')).toThrowError(
      TopicViewNotRegisteredError,
    );
  });
});
