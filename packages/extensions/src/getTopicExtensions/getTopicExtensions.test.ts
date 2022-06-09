import { TOPICS_TEST_DATA } from '@minddrop/topics';
import {
  setup,
  cleanup,
  topicExtension,
  disabledTopicExtension,
} from '../test-utils';
import { getTopicExtensions } from './getTopicExtensions';

const { tSailing } = TOPICS_TEST_DATA;

describe('getTopicExtensions', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the enabled extensions for a topic', () => {
    const result = getTopicExtensions(tSailing.id);

    expect(
      result.find((extensionId) => extensionId === topicExtension.id),
    ).toBeDefined();

    // Should not include disabled extensions
    expect(
      result.find((extensionId) => extensionId === disabledTopicExtension.id),
    ).not.toBeDefined();
  });
});
