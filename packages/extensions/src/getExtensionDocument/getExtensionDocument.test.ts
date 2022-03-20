import { setup, cleanup, topicExtensionDocument } from '../test-utils';
import { useExtensionsStore } from '../useExtensionsStore';
import { getExtensionDocument } from './getExtensionDocument';

describe('getExtensionDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the extension document', () => {
    // Add an extension document to the store
    useExtensionsStore.getState().setExtensionDocument(topicExtensionDocument);

    // Get the extension document
    const document = getExtensionDocument(topicExtensionDocument.extension);

    // Should return the extension document
    expect(document).toEqual(topicExtensionDocument);
  });

  it('returns null if no there is no extension document for the extension', () => {
    expect(getExtensionDocument('missing')).toBeNull();
  });
});
