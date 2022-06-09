import { ViewInstances } from '@minddrop/views';
import { TopicViewInstance } from '../types';
import {
  setup,
  cleanup,
  tSailing,
  core,
  topicViewColumnsConfig,
  TopicColumnsViewData,
  topicViewWithoutCallbacksConfig,
} from '../test-utils';
import { createTopicViewInstance } from './createTopicViewInstance';
import { registerTopicView } from '../registerTopicView';
import { TopicsResource } from '../TopicsResource';
import { ResourceDocumentNotFoundError } from '@minddrop/resources';
import { TopicViewNotRegisteredError } from '../errors';

describe('createTopicViewInstance', () => {
  beforeEach(() => {
    setup();

    // Register test topic views
    registerTopicView(core, topicViewColumnsConfig);
    registerTopicView(core, topicViewWithoutCallbacksConfig);
  });

  afterEach(cleanup);

  it('creates a view instance with custom data applied', () => {
    // Create a topic view instance
    const instance = createTopicViewInstance<TopicColumnsViewData>(
      core,
      tSailing.id,
      topicViewColumnsConfig.id,
    );

    // Should create a viwe instance
    expect(ViewInstances.get(instance.id)).toBeDefined();

    // Should use the view config ID as the view instance type
    expect(instance.type).toEqual(topicViewColumnsConfig.id);

    // Should initialize custom data
    expect(instance.columns).toBeDefined();
  });

  it('works with topic views which do not initialize data', () => {
    // Create a topic view instance
    const instance = createTopicViewInstance(
      core,
      tSailing.id,
      topicViewWithoutCallbacksConfig.id,
    );

    // Should create a view instance
    expect(ViewInstances.get(instance.id)).toBeDefined();
  });

  it('adds the new view instance to the topic', () => {
    // Create a topic view instance
    const instance = createTopicViewInstance(
      core,
      tSailing.id,
      topicViewColumnsConfig.id,
    );

    // Get the topic
    const topic = TopicsResource.get(tSailing.id);

    // Topic should contain the view ID
    expect(topic.views.includes(instance.id)).toBeTruthy();
  });

  it('dispatches a `topics:view:create-instance` event', (done) => {
    let instance: TopicViewInstance;

    // Listen to 'topics:view:create-instance' events
    core.addEventListener('topics:view:create-instance', (payload) => {
      // Payload data should be the new view instance
      expect(payload.data).toEqual(instance);
      done();
    });

    // Create a topic view instance
    instance = createTopicViewInstance(
      core,
      tSailing.id,
      topicViewColumnsConfig.id,
    );
  });

  it('throws a `ResourceDocumentNotFoundError` if the topic does not exist', () => {
    // Attempt to create a view instance for a topic that does
    // not exist. Should throw a `TopicNotFoundError`.
    expect(() =>
      createTopicViewInstance(core, 'missing', topicViewColumnsConfig.id),
    ).toThrowError(ResourceDocumentNotFoundError);
  });

  it('throws a `ViewNotRegisteredError` if the view is not registered', () => {
    // Attempt to create a view instance of a type that is not
    // registered. Should throw a `ViewNotRegisteredError`.
    expect(() =>
      createTopicViewInstance(core, tSailing.id, 'missing'),
    ).toThrowError(TopicViewNotRegisteredError);
  });
});
