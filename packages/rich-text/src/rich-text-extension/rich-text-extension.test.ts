import { onDisable, onRun } from './rich-text-extension';
import {
  setup,
  cleanup,
  core,
  richTextDocument1,
  richTextDocument2,
  headingElement1,
  headingElement2,
} from '../test-utils';
import { clearRichTextElements } from '../clearRichTextElements';
import { getRichTextElements } from '../getRichTextElements';
import {
  RichTextDocumentNotFoundError,
  RichTextElementNotFoundError,
} from '../errors';
import { generateId } from '@minddrop/utils';
import { getRichTextElement } from '../getRichTextElement';
import { getRichTextDocuments } from '../getRichTextDocuments';
import { getRichTextDocument } from '../getRichTextDocument';
import { useRichTextStore } from '../useRichTextStore';

function getElementResourceConnector() {
  return core
    .getResourceConnectors()
    .find(({ type }) => type === 'rich-text:element');
}

function getDocumentResourceConnector() {
  return core
    .getResourceConnectors()
    .find(({ type }) => type === 'rich-text:document');
}

describe('rich text extension', () => {
  beforeEach(setup);

  afterEach(cleanup);

  describe('onRun', () => {
    describe('`rich-text:element` resource', () => {
      it('gets registered', () => {
        // Run the extension
        onRun(core);

        // 'rich-text:element' resource should be registerd
        expect(getElementResourceConnector()).toBeDefined();
      });

      it('handles document loading', () => {
        // Clear rich text elements from the store
        clearRichTextElements();

        // Run the extension
        onRun(core);

        // Get the 'rich-text:element' resource connector
        const connector = getElementResourceConnector();

        // Call the connector's `onLoad` method, simulating an onLoad
        // event from the storage adapter.
        connector.onLoad([headingElement1, headingElement2]);

        // Should load documents into the store
        expect(() =>
          getRichTextElements([headingElement1.id, headingElement2.id]),
        ).not.toThrowError(RichTextElementNotFoundError);
      });

      it('adds new elements to the store', () => {
        // Run the extension
        onRun(core);

        // Get the 'rich-text:element' resource connector
        const connector = getElementResourceConnector();

        // The new element to add
        const element = { ...headingElement1, id: generateId() };

        // Call the connector's `onChange` method with a new rich text element,
        // simulating an onChange event fired when a new document is added to
        // the database.
        connector.onChange(element, false);

        // New element should be in the store
        expect(() => getRichTextElement(element.id)).not.toThrowError(
          RichTextElementNotFoundError,
        );
      });

      it('updates elements in the store', () => {
        // Run the extension
        onRun(core);

        // Get the 'rich-text:element' resource connector
        const connector = getElementResourceConnector();

        // The updated element
        const element = {
          ...headingElement1,
          children: [{ text: 'Updated element' }],
        };

        // Call the connector's `onChange` method with an updated rich text
        // element, simulating an onChange event fired when a document is
        // updated in the database.
        connector.onChange(element, false);

        // Get the element from the store
        const storeElement = getRichTextElement(headingElement1.id);

        // Element should be updated in the store
        expect(storeElement).toEqual(element);
      });

      it('removes deleted elements from the store', () => {
        // Run the extension
        onRun(core);

        // Get the 'rich-text:element' resource connector
        const connector = getElementResourceConnector();

        // Call the connector's `onChange` method with the `deleted` parameter
        // set to true, simulating an onChange event fired when a document is
        // deleted from the database.
        connector.onChange(headingElement1, true);

        // Element should no longer be in the store
        expect(() => getRichTextElement(headingElement1.id)).toThrowError(
          RichTextElementNotFoundError,
        );
      });
    });

    describe('`rich-text:document` resource', () => {
      it('gets registered', () => {
        // Run the extension
        onRun(core);

        // 'rich-text:document' resource should be registerd
        expect(getDocumentResourceConnector()).toBeDefined();
      });

      it('handles document loading', () => {
        // Clear rich text documents from the store
        clearRichTextElements();

        // Run the extension
        onRun(core);

        // Get the 'rich-text:document' resource connector
        const connector = getDocumentResourceConnector();

        // Call the connector's `onLoad` method, simulating an onLoad
        // event from the storage adapter.
        connector.onLoad([richTextDocument1, richTextDocument2]);

        // Should load documents into the store
        expect(() =>
          getRichTextDocuments([richTextDocument1.id, richTextDocument2.id]),
        ).not.toThrowError(RichTextDocumentNotFoundError);
      });

      it('adds new documents to the store', () => {
        // Run the extension
        onRun(core);

        // Get the 'rich-text:document' resource connector
        const connector = getDocumentResourceConnector();

        // The new document to add
        const document = { ...richTextDocument1, id: generateId() };

        // Call the connector's `onChange` method with a new rich text document,
        // simulating an onChange event fired when a new document is added to
        // the database.
        connector.onChange(document, false);

        // New document should be in the store
        expect(() => getRichTextDocument(document.id)).not.toThrowError(
          RichTextDocumentNotFoundError,
        );
      });

      it('updates documents in the store', () => {
        // Run the extension
        onRun(core);

        // Get the 'rich-text:document' resource connector
        const connector = getDocumentResourceConnector();

        // The updated document
        const document = {
          ...richTextDocument1,
          children: ['new-child-id'],
        };

        // Call the connector's `onChange` method with an updated rich text
        // document, simulating an onChange event fired when a document is
        // updated in the database.
        connector.onChange(document, false);

        // Get the document from the store
        const storeDocument = getRichTextDocument(richTextDocument1.id);

        // Document should be updated in the store
        expect(storeDocument).toEqual(document);
      });

      it('removes deleted documents from the store', () => {
        // Run the extension
        onRun(core);

        // Get the 'rich-text:document' resource connector
        const connector = getDocumentResourceConnector();

        // Call the connector's `onChange` method with the `deleted` parameter
        // set to true, simulating an onChange event fired when a document is
        // deleted from the database.
        connector.onChange(richTextDocument1, true);

        // Document should no longer be in the store
        expect(() => getRichTextDocument(richTextDocument1.id)).toThrowError(
          RichTextDocumentNotFoundError,
        );
      });
    });
  });

  describe('onDisable', () => {
    beforeEach(() => onRun(core));

    it('unregisters the `rich-text:element` resource', () => {
      // Disable the extension
      onDisable(core);

      // 'rich-text:element' resource should no longer be registered
      expect(getElementResourceConnector()).toBeUndefined();
    });

    it('unregisters the `rich-text:document` resource', () => {
      // Disable the extension
      onDisable(core);

      // 'rich-text:document' resource should no longer be registered
      expect(getDocumentResourceConnector()).toBeUndefined();
    });

    it('clears all data from the store', () => {
      // Disable the extension
      onDisable(core);

      // Store should no longer contain registered element configs
      expect(useRichTextStore.getState().elementConfigs).toEqual({});
      // Store should no longer contain elements
      expect(useRichTextStore.getState().elements).toEqual({});
      // Store should no longer contain documents
      expect(useRichTextStore.getState().documents).toEqual({});
    });
  });
});
