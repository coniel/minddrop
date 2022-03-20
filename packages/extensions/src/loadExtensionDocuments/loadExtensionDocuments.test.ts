import { getExtensionDocument } from '../getExtensionDocument';
import {
  setup,
  cleanup,
  core,
  topicExtensionDocument,
  appExtensionDocument,
  topicExtensionConfig,
  appExtensionConfig,
} from '../test-utils';
import { loadExtensionDocuments } from './loadExtensionDocuments';

describe('loadExtensionDocuments', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('loads the extension documents into the store', () => {
    // Load extension documents
    loadExtensionDocuments(core, [
      topicExtensionDocument,
      appExtensionDocument,
    ]);

    // Documents should be in the store
    expect(getExtensionDocument(topicExtensionConfig.id)).toEqual(
      topicExtensionDocument,
    );
    expect(getExtensionDocument(appExtensionConfig.id)).toEqual(
      appExtensionDocument,
    );
  });

  it('dispatches a `extensions:load-documents` event', (done) => {
    // The documents to load
    const documents = [topicExtensionDocument, appExtensionDocument];

    // Listen to 'extensions:load-documents' event
    core.addEventListener('extensions:load-documents', (payload) => {
      // Event payload should be the loaded documents
      expect(payload.data).toEqual(documents);
      done();
    });

    // Load the extension documents
    loadExtensionDocuments(core, documents);
  });
});
