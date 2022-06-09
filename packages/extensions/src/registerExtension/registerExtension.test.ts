import { getExtension } from '../getExtension';
import { getExtensionConfig } from '../getExtensionConfig';
import {
  setup,
  cleanup,
  core,
  unregisteredExtensionConfig,
} from '../test-utils';
import { registerExtension } from './registerExtension';
import { ExtensionsResource } from '../ExtensionsResource';

const extensionConfig = unregisteredExtensionConfig;
const extensionId = unregisteredExtensionConfig.id;

describe('registerExtension', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('adds the extension config to the extensions store', () => {
    // Register the extension
    registerExtension(core, extensionConfig);

    // Get the extension config from the store
    const config = getExtensionConfig(extensionId);

    // Store config should match registered config
    expect(config).toEqual(extensionConfig);
  });

  it('creates an extension document if there is none for the extension', () => {
    // Register the extension
    registerExtension(core, extensionConfig);

    // Get the extension
    const extension = getExtension(extensionConfig.id);

    // Should have created an extension document
    expect(ExtensionsResource.get(extension.document)).not.toBeNull();
  });

  it('uses the existing extension document if there is one', () => {
    // Generate an extension document for the extension
    const document = ExtensionsResource.create(core, {
      extension: extensionId,
    });

    // Register the extension
    registerExtension(core, extensionConfig);

    // Get the extension
    const extension = getExtension(extensionConfig.id);

    // Should not have replaced the existing extension document
    expect(extension.document).toBe(document.id);
  });

  it('returns the registered extension', () => {
    // Register the extension
    const result = registerExtension(core, extensionConfig);

    // Get the extension
    const extension = getExtension(extensionId);

    // Returned value should be the extension
    expect(result).toEqual(extension);
  });

  it('dispatches a `extensions:extension:register` event', (done) => {
    // Listen to 'extensions:extension:register' events
    core.addEventListener('extensions:extension:register', (payload) => {
      // Get the registered extension
      const extension = getExtension(extensionId);

      // Payload data should be the registered extension
      expect(payload.data).toEqual(extension);
      done();
    });

    // Register the extension
    registerExtension(core, unregisteredExtensionConfig);
  });
});
