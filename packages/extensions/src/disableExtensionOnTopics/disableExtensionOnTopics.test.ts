import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { getExtension } from '../getExtension';
import {
  setup,
  cleanup,
  topicExtension,
  core,
  topicExtensionNoCallbacks,
} from '../test-utils';
import { disableExtensionOnTopics } from './disableExtensionOnTopics';

const { tSailing, tBoats } = TOPICS_TEST_DATA;

describe('disableExtensionOnTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("removes the topics from the extension's topic list", () => {
    disableExtensionOnTopics(core, topicExtension.id, [tSailing.id, tBoats.id]);

    const extension = getExtension(topicExtension.id);

    expect(extension.topics.includes(tSailing.id)).toBeFalsy();
    expect(extension.topics.includes(tBoats.id)).toBeFalsy();
  });

  it("calls the extension's onDisableTopics callback", () => {
    jest.spyOn(topicExtension, 'onDisableTopics');

    disableExtensionOnTopics(core, topicExtension.id, [tSailing.id]);
    // Should work with extension which have no onDisableTopics callback
    disableExtensionOnTopics(core, topicExtensionNoCallbacks.id, [tSailing.id]);

    expect(topicExtension.onDisableTopics).toHaveBeenCalledWith(core, {
      [tSailing.id]: tSailing,
    });
  });

  it('dispatches a `extensions:diable-topics` event', (done) => {
    core.addEventListener('extensions:disable-topics', (payload) => {
      const { extension, topics } = payload.data;
      expect(extension.id).toBe(topicExtension.id);
      expect(extension.topics.includes(tSailing.id)).toBeFalsy();
      expect(topics[tSailing.id]).toEqual(tSailing);
      done();
    });

    disableExtensionOnTopics(core, topicExtension.id, [tSailing.id]);
  });
});
