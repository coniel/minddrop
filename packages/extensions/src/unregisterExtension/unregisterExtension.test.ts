import { ExtensionNotRegisteredError } from '../errors';
import { getExtension } from '../getExtension';
import { setup, cleanup, topicExtensionConfig, core } from '../test-utils';
import { unregisterExtension } from './unregisterExtension';
import { ExtensionsResource } from '../ExtensionsResource';

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
      ExtensionsResource.store.get(topicExtensionConfig.id),
    ).not.toBeDefined();
  });

  it('dispatches a `extensions:extension:unregister` event', (done) => {
    // Get the extension
    const extension = getExtension(topicExtensionConfig.id);

    // Listen to 'extensions:extension:unregister' events
    core.addEventListener('extensions:extension:unregister', (payload) => {
      // Payload should be the unregistered extension
      expect(payload.data).toEqual(extension);
      done();
    });

    // Unregister the extension
    unregisterExtension(core, topicExtensionConfig.id);
  });
});
