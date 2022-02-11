import { ViewInstanceNotFoundError, Views } from '@minddrop/views';
import { TopicViewConfig, TopicViewInstance } from '..';
import { createTopicViewInstance } from '../createTopicViewInstance';
import { registerTopicView } from '../registerTopicView';
import {
  setup,
  cleanup,
  topicViewColumns,
  core,
  tSailing,
  topicViewWithoutCallbacks,
  topicViewColumnsConfig,
} from '../test-utils';
import { deleteTopicViewInstance } from './deleteTopicViewInstance';

const config: TopicViewConfig = {
  ...topicViewColumnsConfig,
  id: 'on-delete-test',
  onDelete: jest.fn(),
};

describe('deleteTopicViewInstance', () => {
  let viewInstance: TopicViewInstance;

  beforeEach(() => {
    setup();
    viewInstance = createTopicViewInstance(
      core,
      tSailing.id,
      topicViewColumns.id,
    );
  });

  afterEach(cleanup);

  it('deletes the view instance', () => {
    deleteTopicViewInstance(core, viewInstance.id);

    expect(() => Views.getInstance(viewInstance.id)).toThrowError(
      ViewInstanceNotFoundError,
    );
  });

  it("calls topic view's onDelete method if defined", () => {
    jest.spyOn(topicViewColumnsConfig, 'onDelete');

    registerTopicView(core, config);

    const withOnDeleteInstance = createTopicViewInstance(
      core,
      tSailing.id,
      config.id,
    );
    const noCallbacksViewInstance = createTopicViewInstance(
      core,
      tSailing.id,
      topicViewWithoutCallbacks.id,
    );

    deleteTopicViewInstance(core, withOnDeleteInstance.id);
    deleteTopicViewInstance(core, noCallbacksViewInstance.id);

    expect(config.onDelete).toHaveBeenCalledWith(core, withOnDeleteInstance);
  });

  it('dispatches a `topics:delete-view-instance` event', (done) => {
    core.addEventListener('topics:delete-view-instance', (payload) => {
      expect(payload.data).toEqual(viewInstance);
      done();
    });

    deleteTopicViewInstance(core, viewInstance.id);
  });
});
