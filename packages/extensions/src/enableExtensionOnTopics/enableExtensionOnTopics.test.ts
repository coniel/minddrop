import { TOPICS_TEST_DATA } from '@minddrop/topics';
import { getExtension } from '../getExtension';
import {
  setup,
  cleanup,
  core,
  topicExtension,
  topicExtensionNoCallbacks,
} from '../test-utils';
import { enableExtensionOnTopics } from './enableExtensionOnTopics';

const { tCoastalNavigation, tOffshoreNavigation } = TOPICS_TEST_DATA;

describe('enableExtensionsOnTopics', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("adds the topic IDs to the extension's topics list", () => {
    enableExtensionOnTopics(core, topicExtension.id, [
      tCoastalNavigation.id,
      tOffshoreNavigation.id,
    ]);

    const extension = getExtension(topicExtension.id);

    expect(extension.topics.includes(tCoastalNavigation.id)).toBeTruthy();
    expect(extension.topics.includes(tOffshoreNavigation.id)).toBeTruthy();
  });

  it("calls the extension's onEnableTopics callback", () => {
    jest.spyOn(topicExtension, 'onEnableTopics');

    enableExtensionOnTopics(core, topicExtension.id, [tCoastalNavigation.id]);
    // Should work with extension which have no onEnableTopics callback
    enableExtensionOnTopics(core, topicExtensionNoCallbacks.id, [
      tCoastalNavigation.id,
    ]);

    expect(topicExtension.onEnableTopics).toHaveBeenCalledWith(core, {
      [tCoastalNavigation.id]: tCoastalNavigation,
    });
  });

  it('dispatches a `extensions:enable-topics` event', (done) => {
    core.addEventListener('extensions:enable-topics', (payload) => {
      expect(payload.data.extension.id).toEqual(topicExtension.id);
      expect(payload.data.topics[tCoastalNavigation.id]).toEqual(
        tCoastalNavigation,
      );
      done();
    });

    enableExtensionOnTopics(core, topicExtension.id, [tCoastalNavigation.id]);
  });
});
