import { createExtensionDocument } from '../createExtensionDocument';
import { ExtensionDocumentNotFoundError } from '../errors';
import { getExtensionDocument } from '../getExtensionDocument';
import { setup, cleanup, topicExtensionConfig, core } from '../test-utils';
import { deleteExtensionDocument } from './deleteExtensionDocument';

const extensionId = topicExtensionConfig.id;

describe('deleteExtensionDocument', () => {
  beforeEach(() => {
    setup();

    // Create a document for the extension
    createExtensionDocument(core, extensionId);
  });

  afterEach(cleanup);

  it('returns the deleted extension document', () => {
    // Get the extension document
    const document = getExtensionDocument(extensionId);

    // Delete the extension document
    const result = deleteExtensionDocument(core, extensionId);

    // Returned value should be deleted document
    expect(result).toEqual(document);
  });

  it('removes the document from the extensions store', () => {
    // Delete the extension document
    deleteExtensionDocument(core, extensionId);

    // Should no longer be in the extensions store
    expect(getExtensionDocument(extensionId)).toBeNull();
  });

  it('dispatches a `extensions:delete-document` event', (done) => {
    // Get the extension document
    const document = getExtensionDocument(extensionId);

    // Listen to 'extensions:delete-document' events
    core.addEventListener('extensions:delete-document', (payload) => {
      // Payload data should be the deleted document
      expect(payload.data).toEqual(document);
      done();
    });

    // Delete the extension document
    deleteExtensionDocument(core, extensionId);
  });

  it('throws a ExtensionDocumentNotFoundError if the extension document does not exist', () => {
    // Should throw an error
    expect(() => deleteExtensionDocument(core, 'missing')).toThrowError(
      ExtensionDocumentNotFoundError,
    );
  });
});
