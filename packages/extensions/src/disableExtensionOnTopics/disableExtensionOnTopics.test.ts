import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { doesNotContain, mapById } from '@minddrop/utils';
import { getExtension } from '../getExtension';
import {
  setup,
  cleanup,
  topicExtensionConfig,
  core,
  topicNoCallbacksExtension,
} from '../test-utils';
import { disableExtensionOnTopics } from './disableExtensionOnTopics';

const { tSailing, tBoats } = TOPICS_TEST_DATA;

describe('disableExtensionOnTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("removes the topics from the extension's topic list", () => {
    // Disable the extension on two topics
    disableExtensionOnTopics(core, topicExtensionConfig.id, [
      tSailing.id,
      tBoats.id,
    ]);

    // Get the updated extension
    const extension = getExtension(topicExtensionConfig.id);

    // Should no longer contain the topics
    expect(
      doesNotContain(extension.topics, [tSailing.id, tBoats.id]),
    ).toBeTruthy();
  });

  it("calls the extension's onDisableTopics callback", () => {
    jest.spyOn(topicExtensionConfig, 'onDisableTopics');

    // Disable the extension on a topic with a onDisableTopics callback
    disableExtensionOnTopics(core, topicExtensionConfig.id, [tSailing.id]);
    // Disable the extension on a topic without a onDisableTopics callback,
    // (should not do anything).
    disableExtensionOnTopics(core, topicNoCallbacksExtension.id, [tSailing.id]);

    // Should call the extension's onDisableTopics callback with the affted topics
    expect(topicExtensionConfig.onDisableTopics).toHaveBeenCalledWith(
      core,
      mapById([tSailing]),
    );
  });

  it('dispatches a `extensions:diable-topics` event', (done) => {
    // Listen to 'extensions:disable-topics' events
    core.addEventListener('extensions:disable-topics', (payload) => {
      // Get the extension
      const extension = getExtension(topicExtensionConfig.id);

      // Payload data should contain the extension
      expect(payload.data.extension).toEqual(extension);
      // Payload data should contain the topics
      expect(payload.data.topics).toEqual(mapById([tSailing]));
      done();
    });

    // Disable the extension on a topic
    disableExtensionOnTopics(core, topicExtensionConfig.id, [tSailing.id]);
  });
});
