import { useRichTextStore } from './useRichTextStore';
import { mapById } from '@minddrop/utils';
import {
  headingElementConfig,
  paragraphElement1,
  paragraphElement2,
  paragraphElementConfig,
  richTextDocument1,
  richTextDocument2,
} from '../test-utils';

describe('useRichTextStore', () => {
  afterEach(() => {
    // Clear the store
    useRichTextStore.getState().clear();
  });

  describe('documents', () => {
    it('loads documents', () => {
      // Load a document
      useRichTextStore.getState().loadDocuments([richTextDocument1]);

      // Documents should be in the store
      expect(useRichTextStore.getState().documents).toEqual(
        mapById([richTextDocument1]),
      );

      // Load another document
      useRichTextStore.getState().loadDocuments([richTextDocument2]);

      // Should preserve existing documents
      expect(useRichTextStore.getState().documents).toEqual(
        mapById([richTextDocument1, richTextDocument2]),
      );
    });

    it('sets a document', () => {
      // Set a document
      useRichTextStore.getState().setDocument(richTextDocument1);

      // Document should be in the store
      expect(
        useRichTextStore.getState().documents[richTextDocument1.id],
      ).toEqual(richTextDocument1);
    });

    it('removes a document', () => {
      // Set a document
      useRichTextStore.getState().setDocument(richTextDocument1);

      // Remove the document
      useRichTextStore.getState().removeDocument(richTextDocument1.id);

      // Document should no longer be in the store
      expect(
        useRichTextStore.getState().documents[richTextDocument1.id],
      ).toBeUndefined();
    });

    it('clears documents', () => {
      // Load documents
      useRichTextStore
        .getState()
        .loadDocuments([richTextDocument1, richTextDocument2]);

      // Clear documents
      useRichTextStore.getState().clearDocuments();

      // Documents should be cleared
      expect(useRichTextStore.getState().documents).toEqual({});
    });
  });

  describe('elements', () => {
    it('loads elements', () => {
      // Load an element
      useRichTextStore.getState().loadElements([paragraphElement1]);

      // Elements should be in the store
      expect(useRichTextStore.getState().elements).toEqual(
        mapById([paragraphElement1]),
      );

      // Load another element
      useRichTextStore.getState().loadElements([paragraphElement2]);

      // Should preserve existing elements
      expect(useRichTextStore.getState().elements).toEqual(
        mapById([paragraphElement1, paragraphElement2]),
      );
    });

    it('sets an element', () => {
      // Set an element
      useRichTextStore.getState().setElement(paragraphElement1);

      // Element should be in the store
      expect(
        useRichTextStore.getState().elements[paragraphElement1.id],
      ).toEqual(paragraphElement1);
    });

    it('removes an element', () => {
      // Set an element
      useRichTextStore.getState().setElement(paragraphElement1);

      // Remove the element
      useRichTextStore.getState().removeElement(paragraphElement1.id);

      // Element should no longer be in the store
      expect(
        useRichTextStore.getState().elements[paragraphElement1.id],
      ).toBeUndefined();
    });

    it('clears elements', () => {
      // Load elements
      useRichTextStore
        .getState()
        .loadElements([paragraphElement1, paragraphElement2]);

      // Clear elements
      useRichTextStore.getState().clearElements();

      // Elements should be cleared
      expect(useRichTextStore.getState().elements).toEqual({});
    });
  });

  describe('element configs', () => {
    it('adds an element config', () => {
      // Set an element config
      useRichTextStore.getState().setElementConfig(paragraphElementConfig);

      // Element config should be in the store
      expect(
        useRichTextStore.getState().elementConfigs[paragraphElementConfig.type],
      ).toBe(paragraphElementConfig);
      // Adds the type to the end of `registrationOrder`
      expect(useRichTextStore.getState().registrationOrder.slice(-1)[0]).toBe(
        paragraphElementConfig.type,
      );
    });

    it('removes an element config', () => {
      // Set an element config
      useRichTextStore.getState().setElementConfig(paragraphElementConfig);

      // Remove the element config
      useRichTextStore
        .getState()
        .removeElementConfig(paragraphElementConfig.type);

      // Element config should no longer be in the store
      expect(
        useRichTextStore.getState().elementConfigs[paragraphElementConfig.type],
      ).toBeUndefined();
      // Removes the element type from `registrationOrder`
      expect(useRichTextStore.getState().registrationOrder).not.toContain(
        paragraphElementConfig.type,
      );
    });

    it('clears element configs', () => {
      // Set a couple of element configs
      useRichTextStore.getState().setElementConfig(headingElementConfig);
      useRichTextStore.getState().setElementConfig(paragraphElementConfig);

      // Clear element configs
      useRichTextStore.getState().clearElementConfigs();

      // Element configs should be cleared
      expect(useRichTextStore.getState().elementConfigs).toEqual({});
      // Registration order should be cleared
      expect(useRichTextStore.getState().registrationOrder).toEqual([]);
    });
  });

  it('clears the store', () => {
    // Set a document
    useRichTextStore.getState().setDocument(richTextDocument1);
    // Set an element
    useRichTextStore.getState().setElement(paragraphElement1);
    // Set an element config
    useRichTextStore.getState().setElementConfig(paragraphElementConfig);

    // Clear the store
    useRichTextStore.getState().clear();

    // Get the store data
    const { documents, elements, elementConfigs, registrationOrder } =
      useRichTextStore.getState();

    // Should clear documents
    expect(documents).toEqual({});
    // Should clear elements
    expect(elements).toEqual({});
    // Should clear element configs
    expect(elementConfigs).toEqual({});
    // Should clear registration order
    expect(registrationOrder).toEqual([]);
  });
});
