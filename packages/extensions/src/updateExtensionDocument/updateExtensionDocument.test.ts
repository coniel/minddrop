import { createExtensionDocument } from '../createExtensionDocument';
import { ExtensionDocumentNotFoundError } from '../errors';
import { getExtensionDocument } from '../getExtensionDocument';
import { setup, cleanup, core, topicExtensionConfig } from '../test-utils';
import { updateExtensionDocument } from './updateExtensionDocument';

const extensionId = topicExtensionConfig.id;

describe('updateExtensionDocument', () => {
  beforeEach(() => {
    setup();

    // Create a document for the extension
    createExtensionDocument(core, extensionId);
  });

  afterEach(cleanup);

  it('returns the updated document', () => {
    // Update the extension document
    const updated = updateExtensionDocument(core, extensionId, {
      enabled: false,
    });

    // Should return the updated document
    expect(updated.enabled).toBe(false);
  });

  it('updates the document in the extensions store', () => {
    // Update the extension document
    const updated = updateExtensionDocument(core, extensionId, {
      enabled: false,
    });

    // Get the document from the store
    const document = getExtensionDocument(extensionId);

    // Store document should match updated document
    expect(document).toEqual(updated);
  });

  it('dispatches a `extensions:update-document` event', (done) => {
    // The changes made to the document
    const changes = { enabled: false };
    // The extension document before the update
    const before = getExtensionDocument(extensionId);

    // Listen to 'extensions:update-document' events
    core.addEventListener('extensions:update-document', (payload) => {
      // Get the updated extension document
      const after = getExtensionDocument(extensionId);

      // Payload data should be the update object
      expect(payload.data).toEqual({ before, after, changes });
      done();
    });

    // Update the extension document
    updateExtensionDocument(core, extensionId, changes);
  });

  it('throws a ExtensionDocumentNotFoundError if the extension document does not exist', () => {
    // Should throw an error
    expect(() =>
      updateExtensionDocument(core, 'missing', { enabled: false }),
    ).toThrowError(ExtensionDocumentNotFoundError);
  });
});
