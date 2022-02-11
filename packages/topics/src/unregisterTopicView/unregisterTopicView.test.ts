import { ViewNotRegisteredError, Views } from '@minddrop/views';
import { TopicViewNotRegisteredError } from '..';
import { getTopicView } from '../getTopicView';
import { setup, cleanup, topicViewColumns, core } from '../test-utils';
import { unregisterTopicView } from './unregisterTopicView';

describe('unregisterTopicView', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('unregisters the view', () => {
    unregisterTopicView(core, topicViewColumns.id);

    expect(() => Views.get(topicViewColumns.id)).toThrowError(
      ViewNotRegisteredError,
    );
  });

  it('unregisters the topic view', () => {
    unregisterTopicView(core, topicViewColumns.id);

    expect(() => getTopicView(topicViewColumns.id)).toThrowError(
      TopicViewNotRegisteredError,
    );
  });

  it('dispatches a `topics:unregister-view` event', (done) => {
    core.addEventListener('topics:unregister-view', (payload) => {
      expect(payload.data).toEqual(topicViewColumns);
      done();
    });

    unregisterTopicView(core, topicViewColumns.id);
  });
});
