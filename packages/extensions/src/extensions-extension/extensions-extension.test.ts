import { onDisable, onRun } from './extensions-extension';
import {
  setup,
  cleanup,
  core,
  topicExtension,
  appExtension,
  disabledTopicExtension,
  topicExtensionConfig,
} from '../test-utils';
import { generateExtensionDocument } from '../generateExtensionDocument';
import { getExtensionDocument } from '../getExtensionDocument';
import { registerExtension } from '../registerExtension';
import { useExtensionsStore } from '../useExtensionsStore';

function getExtensionResourceConnector() {
  return core
    .getResourceConnectors()
    .find(({ type }) => type === 'extensions:extension');
}

describe('extensions extension', () => {
  describe('onRun', () => {
    // Start with a cleared state
    beforeAll(cleanup);

    afterEach(cleanup);

    describe('extensions resource registration', () => {
      it('loads extensions', () => {
        // Run the extension
        onRun(core);

        // Get the extensions resource connector
        const connector = getExtensionResourceConnector();

        // Call the resource connector's onLoad method, simulating
        // an onLoad event from the storage-adapter.
        connector.onLoad([
          topicExtension,
          appExtension,
          disabledTopicExtension,
        ]);
      });

      it('adds new documents to the extensions store', () => {
        // Run the extension
        onRun(core);

        // Generate a new extension document
        const document = generateExtensionDocument('extension-id');

        // Get the extensions resource connector
        const connector = getExtensionResourceConnector();

        // Call the resource connector's onChange method with the new
        // document, simulating an onChange event from the storage-adapter.
        connector.onChange(document, false);

        // Document should be added to the store
        expect(getExtensionDocument('extension-id')).toEqual(document);
      });

      it('updates documents in the store', () => {
        // Run the extension
        onRun(core);

        // Register an extension
        registerExtension(core, topicExtensionConfig);

        // Get the extension document
        const document = getExtensionDocument(topicExtensionConfig.id);

        // Modify the extension document
        document.enabled = false;

        // Get the extensions resource connector
        const connector = getExtensionResourceConnector();

        // Call the resource connector's onChange method with the modified
        // document, simulating an onChange event from the storage-adapter.
        connector.onChange(document, false);

        // Document should be updated in the store
        expect(getExtensionDocument(topicExtension.id)).toEqual(document);
      });

      it('removes documents from the store', () => {
        // Run the extension
        onRun(core);

        // Register an extension
        registerExtension(core, topicExtensionConfig);

        // Get the extension document
        const document = getExtensionDocument(topicExtensionConfig.id);

        // Get the extensions resource connector
        const connector = getExtensionResourceConnector();

        // Call the resource connector's onChange method with the delete
        // parameter set to `true`, simulating an onChange event from the
        // storage-adapter.
        connector.onChange(document, true);

        // Document should be removed from the store
        expect(getExtensionDocument(topicExtension.id)).toBeNull();
      });
    });
  });

  describe('onDisable', () => {
    it('clears the store', () => {
      // Hydrate the store
      setup();

      // Disable the extension
      onDisable(core);

      // Get store data
      const { extensionConfigs, extensionDocuments } =
        useExtensionsStore.getState();

      // Store should be cleared
      expect(extensionConfigs).toEqual({});
      expect(extensionDocuments).toEqual({});
    });

    it('unregisters the extenion documents resource', () => {
      // Run the extension
      onRun(core);

      // Disable the extension
      onDisable(core);

      // Resource should no longer be registered
      expect(getExtensionResourceConnector()).not.toBeDefined();
    });
  });
});
