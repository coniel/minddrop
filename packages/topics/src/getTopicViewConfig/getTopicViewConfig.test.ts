import { TopicViewNotRegisteredError } from '../errors';
import {
  baseTopicViewInstanceDataSchema,
  registerTopicView,
} from '../registerTopicView';
import { cleanup, core, topicViewColumnsConfig } from '../test-utils';
import { getTopicViewConfig } from './getTopicViewConfig';

describe('getTopicViewConfig', () => {
  beforeAll(() => {
    // Register a test topic view config
    registerTopicView(core, topicViewColumnsConfig);
  });

  afterEach(cleanup);

  it('returns the topic view config', () => {
    // Get a topic view config
    const config = getTopicViewConfig(topicViewColumnsConfig.id);

    // Should return the registered topic view config
    expect(config).toEqual({
      ...topicViewColumnsConfig,
      extension: core.extensionId,
      dataSchema: {
        ...topicViewColumnsConfig.dataSchema,
        ...baseTopicViewInstanceDataSchema,
      },
      type: 'instance',
    });
  });

  it('throws a TopicViewNotRegisteredError if the view is not registered', () => {
    // Attempt to retrieve an unregistered topic view config.
    // Should throw a `TopicViewNotRegisteredError`.
    expect(() => getTopicViewConfig('unregistered')).toThrowError(
      TopicViewNotRegisteredError,
    );
  });
});
