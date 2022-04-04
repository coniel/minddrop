import {
  RichTextDocumentNotFoundError,
  RichTextElementNotFoundError,
} from '../errors';
import {
  setup,
  cleanup,
  core,
  headingElement1,
  richTextDocument1,
  headingElement2,
} from '../test-utils';
import { getRichTextElement } from '../getRichTextElement';
import { setChildrenInRichTextDocument } from './setChildrenInRichTextDocument';
import { arrayContainsObject, mapById } from '@minddrop/utils';
import { ParentReferences } from '@minddrop/core';
import { getRichTextDocument } from '../getRichTextDocument';

describe('setChildrenInRichTextDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the document does not exist', () => {
    // Attempt to set children on a document which does not exist.
    // Should throw a `RichTextDocumentNotFoundError`.
    expect(() =>
      setChildrenInRichTextDocument(core, 'missing', [headingElement1.id]),
    ).toThrowError(RichTextDocumentNotFoundError);
  });

  it('throws if added elements do not exist', () => {
    // Attempt to set a non-existent child on a document. Should
    // throw a `RichTextElementNotFoundError`.
    expect(() =>
      setChildrenInRichTextDocument(core, richTextDocument1.id, ['missing']),
    ).toThrowError(RichTextElementNotFoundError);
  });

  it('updates the document', () => {
    // The updated children value
    const children = [richTextDocument1.children[0], headingElement2.id];

    // Set children on a document
    setChildrenInRichTextDocument(core, richTextDocument1.id, children);

    // Get the updated document
    const document = getRichTextDocument(richTextDocument1.id);

    // Document children should be updated
    expect(document.children).toEqual(children);
  });

  it('returns the updated document', () => {
    // The updated children value
    const children = [richTextDocument1.children[0], headingElement2.id];

    // Set children on a document
    const document = setChildrenInRichTextDocument(
      core,
      richTextDocument1.id,
      children,
    );

    // Should return the updated document
    expect(document.children).toEqual(children);
  });

  it('removes the document as a prent from removed child elements', () => {
    // Set children on a document, removing an element
    setChildrenInRichTextDocument(core, richTextDocument1.id, [
      richTextDocument1.children[1],
      headingElement2.id,
    ]);

    // Get the updated removed child element
    const element = getRichTextElement(richTextDocument1.children[0]);

    // The document parent reference
    const parentReference = ParentReferences.generate(
      'rich-text-document',
      richTextDocument1.id,
    );

    // Element should no longer have the document as a parent
    expect(arrayContainsObject(element.parents, parentReference)).toBeFalsy();
  });

  it('adds the document as a prent on added child elements', () => {
    // Set children on a document, adding a new one
    setChildrenInRichTextDocument(core, richTextDocument1.id, [
      ...richTextDocument1.children,
      headingElement2.id,
    ]);

    // Get the updated added child element
    const element = getRichTextElement(headingElement2.id);

    // The document parent reference
    const parentReference = ParentReferences.generate(
      'rich-text-document',
      richTextDocument1.id,
    );

    // Element should have the document as a parent
    expect(arrayContainsObject(element.parents, parentReference)).toBeTruthy();
  });

  it('sets the new document revision if provided', () => {
    // Set children on a document
    setChildrenInRichTextDocument(
      core,
      richTextDocument1.id,
      [headingElement1.id],
      'new-revision-id',
    );

    // Get the updated document
    const document = getRichTextDocument(richTextDocument1.id);

    // Document revision should be updated
    expect(document.revision).toEqual('new-revision-id');
  });

  it('does not modify revision if not provided', () => {
    // Set children on a document
    setChildrenInRichTextDocument(core, richTextDocument1.id, [
      headingElement1.id,
    ]);

    // Get the updated document
    const document = getRichTextDocument(richTextDocument1.id);

    // Document revision should be unchanged
    expect(document.revision).toEqual(document.revision);
  });

  it('dispatches a `rich-text-documents:set-children` event', (done) => {
    // Listen to 'rich-text-documents:set-children' events
    core.addEventListener('rich-text-documents:set-children', (payload) => {
      // Get the updated document
      const document = getRichTextDocument(richTextDocument1.id);
      // Get the updated removed child element
      const removedElement = getRichTextElement(richTextDocument1.children[0]);
      // Get the updated added child element
      const addedElement = getRichTextElement(headingElement2.id);

      // Payload data should contain the updated document
      expect(payload.data.document).toEqual(document);
      // Payload data should contain the removed elements
      expect(payload.data.removedElements).toEqual(mapById([removedElement]));
      // Payload data should contain the added elements
      expect(payload.data.addedElements).toEqual(mapById([addedElement]));
      done();
    });

    // Set the children on a document, removing its first child element
    // and adding a new one.
    setChildrenInRichTextDocument(core, richTextDocument1.id, [
      richTextDocument1.children[1],
      headingElement2.id,
    ]);
  });
});
