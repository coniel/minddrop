import { getExtensionDocument } from '../getExtensionDocument';
import { setup, cleanup, core, topicExtensionConfig } from '../test-utils';
import { createExtensionDocument } from './createExtensionDocument';

describe('createExtensionDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the extension document', () => {
    // Create an extension document
    const document = createExtensionDocument(core, topicExtensionConfig.id);

    // Should return the document
    expect(document).toBeDefined();
    expect(document.extension).toBe(topicExtensionConfig.id);
  });

  it('adds the document to the extensions store', () => {
    // Create an extension document
    const document = createExtensionDocument(core, topicExtensionConfig.id);

    // Should be in the store
    expect(getExtensionDocument(topicExtensionConfig.id)).toEqual(document);
  });

  it('dispatches a `extensions:create-document` event', (done) => {
    // Listen to 'extensions:create-document' events
    core.addEventListener('extensions:create-document', (payload) => {
      // Get the document
      const document = getExtensionDocument(topicExtensionConfig.id);

      // Payload data should be the created document
      expect(payload.data).toEqual(document);
      done();
    });

    // Create an extension document
    createExtensionDocument(core, topicExtensionConfig.id);
  });
});
