import { ViewNotRegisteredError, Views } from '@minddrop/views';
import { registerTopicView } from '../registerTopicView';
import { cleanup, topicViewColumnsConfig, core } from '../test-utils';
import { TopicViewConfigsStore } from '../TopicViewConfigsStore';
import { unregisterTopicView } from './unregisterTopicView';

describe('unregisterTopicView', () => {
  beforeEach(() => {
    // Register a test view
    registerTopicView(core, topicViewColumnsConfig);
  });

  afterEach(cleanup);

  it('unregisters the view', () => {
    // Unregister a topic view
    unregisterTopicView(core, topicViewColumnsConfig.id);

    // Attempt to retrieve the unregistered view. Should
    // throw a `ViewNotRegisteredError`.
    expect(() => Views.get(topicViewColumnsConfig.id)).toThrowError(
      ViewNotRegisteredError,
    );
  });

  it('unregisters the topic view', () => {
    // Unregister a topic view
    unregisterTopicView(core, topicViewColumnsConfig.id);

    // Topic view should no longer be registered
    expect(
      TopicViewConfigsStore.get(topicViewColumnsConfig.id),
    ).toBeUndefined();
  });

  it('dispatches a `topics:view:unregister` event', (done) => {
    // Get the registered view config
    const config = TopicViewConfigsStore.get(topicViewColumnsConfig.id);

    // Listen to 'topics:view:unregister' events
    core.addEventListener('topics:view:unregister', (payload) => {
      // Event payload should be the view config
      expect(payload.data).toEqual(config);
      done();
    });

    // Unregister a topic view
    unregisterTopicView(core, topicViewColumnsConfig.id);
  });
});
