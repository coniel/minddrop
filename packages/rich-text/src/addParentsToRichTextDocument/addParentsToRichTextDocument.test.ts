import {
  ParentReferences,
  ParentReferenceValidationError,
} from '@minddrop/core';
import { setup, cleanup, core, richTextDocument1 } from '../test-utils';
import { getRichTextDocument } from '../getRichTextDocument';
import { addParentsToRichTextDocument } from './addParentsToRichTextDocument';

describe('addParentsToRichTextDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('validates the parent references', () => {
    // Attempt to add an invalid parent reference to an document.
    // Should throw a `ParentReferenceValidationError`.
    expect(() =>
      addParentsToRichTextDocument(core, richTextDocument1.id, [
        // @ts-ignore
        { id: 'parent-id' },
      ]),
    ).toThrowError(ParentReferenceValidationError);
  });

  it('adds the parent references to the document', () => {
    // Add a parent reference to an document
    addParentsToRichTextDocument(core, richTextDocument1.id, [
      { type: 'test', id: 'id' },
    ]);

    // Get the updated document
    const document = getRichTextDocument(richTextDocument1.id);

    // Document should contain the added parent
    expect(ParentReferences.contains('test', document.parents)).toBeTruthy();
  });

  it('returns the updated document', () => {
    // Add a parent reference to an document
    const document = addParentsToRichTextDocument(core, richTextDocument1.id, [
      { type: 'test', id: 'id' },
    ]);

    // Should return the updated document
    expect(ParentReferences.contains('test', document.parents)).toBeTruthy();
  });

  it('dispatches a `rich-text-documents:add-parents` event', (done) => {
    // The parents to add
    const parents = [{ type: 'test', id: 'id' }];

    // Listen to 'rich-text-documents:add-parents' events
    core.addEventListener('rich-text-documents:add-parents', (payload) => {
      // Get the updated document
      const document = getRichTextDocument(richTextDocument1.id);

      // Payload data should contain the updated document
      expect(payload.data.document).toEqual(document);
      // Payload data should contain the added parents
      expect(payload.data.parents).toEqual(parents);
      done();
    });

    // Add a parent reference to an document
    addParentsToRichTextDocument(core, richTextDocument1.id, parents);
  });
});
