import { Views } from '@minddrop/views';
import { TopicViewInstance } from '../types';
import { TopicNotFoundError, TopicViewNotRegisteredError } from '../errors';
import { getTopic } from '../getTopic';
import {
  setup,
  cleanup,
  tSailing,
  core,
  topicViewColumns,
  TopicColumnsView,
  topicViewWithoutCallbacks,
} from '../test-utils';
import { createTopicViewInstance } from './createTopicViewInstance';

describe('createTopicViewInstance', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates a view instance with custom data applied', () => {
    const instance = createTopicViewInstance<TopicColumnsView>(
      core,
      tSailing.id,
      topicViewColumns.id,
    );

    expect(Views.getInstance(instance.id)).toEqual(instance);
    expect(instance.view).toEqual(topicViewColumns.id);
    expect(instance.columns).toBeDefined();
  });

  it('works with topic views which do not define an onCreate view', () => {
    const instance = createTopicViewInstance<TopicColumnsView>(
      core,
      tSailing.id,
      topicViewWithoutCallbacks.id,
    );

    expect(Views.getInstance(instance.id)).toEqual(instance);
  });

  it('adds the new view instance to the topic', () => {
    const instance = createTopicViewInstance(
      core,
      tSailing.id,
      topicViewColumns.id,
    );
    const topic = getTopic(tSailing.id);

    expect(topic.views.includes(instance.id)).toBeTruthy();
  });

  it('dispatches a `topics:create-view-instance` event', (done) => {
    let instance: TopicViewInstance;

    core.addEventListener('topics:create-view-instance', (payload) => {
      expect(payload.data).toEqual(instance);
      done();
    });

    instance = createTopicViewInstance(core, tSailing.id, topicViewColumns.id);
  });

  it('throws a TopicNotFoundError if the topic does not exist', () => {
    expect(() =>
      createTopicViewInstance(core, 'missing', topicViewColumns.id),
    ).toThrowError(TopicNotFoundError);
  });

  it('throws a TopicViewNotRegisteredError if the view is not registered', () => {
    expect(() =>
      createTopicViewInstance(core, tSailing.id, 'missing'),
    ).toThrowError(TopicViewNotRegisteredError);
  });
});
