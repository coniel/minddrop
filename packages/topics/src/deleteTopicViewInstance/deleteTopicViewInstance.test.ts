import { ViewInstances } from '@minddrop/views';
import { TopicViewInstance, TopicViewConfig } from '../types';
import { createTopicViewInstance } from '../createTopicViewInstance';
import { registerTopicView } from '../registerTopicView';
import {
  setup,
  cleanup,
  core,
  tSailing,
  topicViewWithoutCallbacksConfig,
  topicViewColumnsConfig,
} from '../test-utils';
import { deleteTopicViewInstance } from './deleteTopicViewInstance';

describe('deleteTopicViewInstance', () => {
  let viewInstance: TopicViewInstance;

  beforeEach(() => {
    setup();

    // Register test topic views
    registerTopicView(core, topicViewColumnsConfig);
    registerTopicView(core, topicViewWithoutCallbacksConfig);

    viewInstance = createTopicViewInstance(
      core,
      tSailing.id,
      topicViewColumnsConfig.id,
    );
  });

  afterEach(cleanup);

  it('deletes the view instance', () => {
    // Delete a view instance
    deleteTopicViewInstance(core, viewInstance.id);

    // View instance should be deleted
    expect(ViewInstances.get(viewInstance.id).deleted).toBe(true);
  });

  it("calls topic view's onDelete method if defined", () => {
    const config: TopicViewConfig = {
      ...topicViewColumnsConfig,
      id: 'on-delete-test',
      onDelete: jest.fn(),
    };

    // Register the test topic view
    registerTopicView(core, config);

    // Create a view instance using the config created above
    viewInstance = createTopicViewInstance(core, tSailing.id, config.id);

    // Delete a view instance
    deleteTopicViewInstance(core, viewInstance.id);

    // Get the updated view instance
    viewInstance = ViewInstances.get(viewInstance.id);

    // Should call the view config's `onDelete` callback
    expect(config.onDelete).toHaveBeenCalledWith(core, viewInstance);
  });

  it('supports views without an onDelete callback', () => {
    // Create a view instance for a view which does not
    // define an `onDelete` callback.
    const noOnDelete = createTopicViewInstance(
      core,
      tSailing.id,
      topicViewWithoutCallbacksConfig.id,
    );

    // Delete the view instance created above
    expect(() => deleteTopicViewInstance(core, noOnDelete.id)).not.toThrow();
  });

  it('dispatches a `topics:view:delete-instance` event', (done) => {
    // Listen to 'topics:view:delete-instance' events
    core.addEventListener('topics:view:delete-instance', (payload) => {
      // Get the deleted topic view instance
      const deleted = ViewInstances.get(viewInstance.id);

      // Payload data should be the deleted view instance
      expect(payload.data).toEqual(deleted);
      done();
    });

    // Delete a topic view instance
    deleteTopicViewInstance(core, viewInstance.id);
  });
});
