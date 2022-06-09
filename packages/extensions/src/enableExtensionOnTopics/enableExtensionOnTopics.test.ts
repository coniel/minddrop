import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { contains, mapById } from '@minddrop/utils';
import { getExtension } from '../getExtension';
import {
  setup,
  cleanup,
  core,
  topicExtensionConfig,
  topicNoCallbacksExtension,
} from '../test-utils';
import { enableExtensionOnTopics } from './enableExtensionOnTopics';

const { tCoastalNavigation, tOffshoreNavigation } = TOPICS_TEST_DATA;

describe('enableExtensionsOnTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("adds the topic IDs to the extension's topics list", () => {
    // Enable the extension on two topics
    enableExtensionOnTopics(core, topicExtensionConfig.id, [
      tCoastalNavigation.id,
      tOffshoreNavigation.id,
    ]);

    // Get the updated extension
    const extension = getExtension(topicExtensionConfig.id);

    // Extension should contain the topics
    expect(
      contains(extension.topics, [
        tCoastalNavigation.id,
        tOffshoreNavigation.id,
      ]),
    ).toBeTruthy();
  });

  it("calls the extension's onEnableTopics callback", () => {
    jest.spyOn(topicExtensionConfig, 'onEnableTopics');

    // Enable topics on an extension wich has a onEnableTopics callback
    enableExtensionOnTopics(core, topicExtensionConfig.id, [
      tCoastalNavigation.id,
    ]);
    // Enable topics on an extension wich does not have a onEnableTopics
    //  callback,(should do nothing).
    enableExtensionOnTopics(core, topicNoCallbacksExtension.id, [
      tCoastalNavigation.id,
    ]);

    // Should call the onEnableTopics callback
    expect(topicExtensionConfig.onEnableTopics).toHaveBeenCalledWith(core, {
      [tCoastalNavigation.id]: tCoastalNavigation,
    });
  });

  it('dispatches a `extensions:extension:enable-topics` event', (done) => {
    // Listen to 'extensions:extension:enable-topics' events
    core.addEventListener('extensions:extension:enable-topics', (payload) => {
      // Get the extension
      const extension = getExtension(topicExtensionConfig.id);

      // Payload data should contain the extension
      expect(payload.data.extension).toEqual(extension);
      // Payload data should contain the topics
      expect(payload.data.topics).toEqual(mapById([tCoastalNavigation]));
      done();
    });

    // Enable the extension on a topic
    enableExtensionOnTopics(core, topicExtensionConfig.id, [
      tCoastalNavigation.id,
    ]);
  });
});
