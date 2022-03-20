import { ExtensionNotRegisteredError } from '../errors';
import { getExtension } from '../getExtension';
import { setup, cleanup, topicExtensionConfig, core } from '../test-utils';
import { useExtensionsStore } from '../useExtensionsStore';
import { unregisterExtension } from './unregisterExtension';

describe('unregisterExtension', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('removes the extension from the store', () => {
    // Unregister an extension
    unregisterExtension(core, topicExtensionConfig.id);

    // Extension should no longer be registered
    expect(() => getExtension(topicExtensionConfig.id)).toThrowError(
      ExtensionNotRegisteredError,
    );
  });

  it('deletes the extension document', () => {
    // Unregister an extension
    unregisterExtension(core, topicExtensionConfig.id);

    // Store should no longer contain the extension document
    expect(
      useExtensionsStore.getState().extensionDocuments[topicExtensionConfig.id],
    ).not.toBeDefined();
  });

  it('dispatches a `extensions:unregister` event', (done) => {
    // Get the extension
    const extension = getExtension(topicExtensionConfig.id);

    // Listen to 'extensions:unregister' events
    core.addEventListener('extensions:unregister', (payload) => {
      // Payload should be the unregistered extension
      expect(payload.data).toEqual(extension);
      done();
    });

    // Unregister the extension
    unregisterExtension(core, topicExtensionConfig.id);
  });
});
