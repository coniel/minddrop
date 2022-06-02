import { setup, cleanup, coreA1, coreA2, coreC1 } from '../test-utils';
import { LocalStoreResource } from '../LocalStoreResource';
import { getPersistentStoreDocument } from './getPersistentStoreDocument';
import { GlobalStoreResource } from '../GlobalStoreResource';
import { LocalPersistentStoreDocument } from '../types';
import { ResourceTypeNotRegisteredError } from '@minddrop/resources';

describe('getPersistentStoreDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('global store', () => {
    it("returns the extension's global persistent store document", () => {
      // Get extension A's global persistent store document
      const document = getPersistentStoreDocument(coreA1, GlobalStoreResource);

      // Should return the correct extension document
      expect(document.extension).toEqual(coreA1.extensionId);
    });

    it('returns undefined if the document does not exist', () => {
      // Get extension C's global persistent store document
      // (which does not exist).
      const document = getPersistentStoreDocument(coreC1, GlobalStoreResource);

      // Should return null
      expect(document).toBeNull();
    });

    it('throws if the persistent store was not initialized', () => {
      // Attempt to get the document of an uninitialized
      // global persistent store. Should throw a
      // `ResourceTypeNotRegisteredError`.
      expect(() =>
        getPersistentStoreDocument(
          { ...coreA1, extensionId: 'unregistered' },
          GlobalStoreResource,
        ),
      ).toThrowError(ResourceTypeNotRegisteredError);
    });
  });

  describe('local store', () => {
    it("returns the extension's local persistent store document", () => {
      // Get extension A's local persistent store document for
      // app isntance 'app-2'.
      const document = getPersistentStoreDocument(coreA2, LocalStoreResource);

      // Should return the correct extension document
      expect(document.extension).toEqual(coreA2.extensionId);
      // Should return the extension document for the A2 app
      expect((document as LocalPersistentStoreDocument).app).toEqual(
        coreA2.appId,
      );
    });

    it('returns undefined if the document does not exist for this extension', () => {
      // Get extension C's local persistent store document
      // (which does not exist).
      const document = getPersistentStoreDocument(coreC1, LocalStoreResource);

      // Should return null
      expect(document).toBeNull();
    });

    it('returns undefined if the document does not exist for this app', () => {
      // Get the local persistent store document for an extension
      // which has documents for other app instances, but not the
      // currentone.
      const document = getPersistentStoreDocument(
        { ...coreA1, appId: 'new-app' },
        LocalStoreResource,
      );

      // Should return null
      expect(document).toBeNull();
    });

    it('throws if the persistent store was not initialized', () => {
      // Attempt to get the document of an uninitialized
      // local persistent store. Should throw a
      // `ResourceTypeNotRegisteredError`.
      expect(() =>
        getPersistentStoreDocument(
          { ...coreA1, extensionId: 'unregistered' },
          LocalStoreResource,
        ),
      ).toThrowError(ResourceTypeNotRegisteredError);
    });
  });
});
