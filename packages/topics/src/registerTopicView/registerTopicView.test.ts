import { registerTopicView } from './registerTopicView';
import { cleanup, core, unregisteredTopicViewConfig } from '../test-utils';
import { Views } from '@minddrop/views';
import { TopicViewConfigsStore } from '../TopicViewConfigsStore';

describe('registerView', () => {
  beforeEach(() => {
    // Clear registered views
    TopicViewConfigsStore.clear();
  });

  afterEach(cleanup);

  it('registers the view', () => {
    // Register a topic view
    registerTopicView(core, unregisteredTopicViewConfig);

    // View should be registered
    expect(Views.get(unregisteredTopicViewConfig.id)).toBeDefined();
  });

  it('registers the topic view', () => {
    // Register a topic view
    registerTopicView(core, unregisteredTopicViewConfig);

    // Topic view should be registered
    expect(
      TopicViewConfigsStore.get(unregisteredTopicViewConfig.id),
    ).toBeDefined();
  });

  it('dispatches a `topics:view:register` event', (done) => {
    // Listen to 'topics:view:register' events
    core.addEventListener('topics:view:register', (payload) => {
      // Get the registered config
      const config = Views.get(unregisteredTopicViewConfig.id);

      // Payload data should be the registered view config
      expect(payload.data).toEqual(config);
      done();
    });

    // Register a topic view
    registerTopicView(core, unregisteredTopicViewConfig);
  });
});
