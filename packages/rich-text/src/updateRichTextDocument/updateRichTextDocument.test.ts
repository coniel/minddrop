import { MockDate } from '@minddrop/test-utils';
import {
  RichTextDocumentNotFoundError,
  RichTextElementNotFoundError,
} from '../errors';
import { getRichTextDocument } from '../getRichTextDocument';
import { setup, cleanup, core, richTextDocument1 } from '../test-utils';
import { updateRichTextDocument } from './updateRichTextDocument';

describe('updateRichTextDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the document does not exist', () => {
    // Attempt to update a document which does not exist.
    // Should throw a `RichTextDocumentNotFoundError`.
    expect(() => updateRichTextDocument(core, 'missing', {})).toThrowError(
      RichTextDocumentNotFoundError,
    );
  });

  it('validates the updated document', () => {
    // Attempt to update a document by adding a non-existant child
    // element. Should throw a `RichTextElementNotFoundError`.
    expect(() =>
      updateRichTextDocument(core, richTextDocument1.id, {
        children: ['missing'],
      }),
    ).toThrowError(RichTextElementNotFoundError);
  });

  it('updates the document in the rich text store', () => {
    // Update a document
    updateRichTextDocument(core, richTextDocument1.id, {
      revision: 'new-revision',
    });

    // Get the document from the store
    const document = getRichTextDocument(richTextDocument1.id);

    // Document should be updated
    expect(document.revision).toBe('new-revision');
  });

  it('returns the updated document', () => {
    // Update a document
    const document = updateRichTextDocument(core, richTextDocument1.id, {
      revision: 'new-revision',
    });

    // Document should be updated
    expect(document.revision).toBe('new-revision');
  });

  it('sets the `updatedAt` timestamp', () => {
    MockDate.set('01/01/2000');

    // Update a document
    const document = updateRichTextDocument(core, richTextDocument1.id, {
      revision: 'new-revision',
    });

    // Updated at should be set to now
    expect(document.updatedAt).toEqual(new Date());

    MockDate.reset();
  });

  it('dispatches a `rich-text-documents:update` evenet', (done) => {
    // The changes to apply
    const changes = { revision: 'new-revision' };

    // Listen to 'rich-text-documents:update' events
    core.addEventListener('rich-text-documents:update', (payload) => {
      // Get the updated document
      const after = getRichTextDocument(richTextDocument1.id);

      // Payload data should be an update object
      expect(payload.data).toEqual({
        after,
        before: richTextDocument1,
        changes: { ...changes, updatedAt: after.updatedAt },
      });
      done();
    });

    // Update a document
    updateRichTextDocument(core, richTextDocument1.id, changes);
  });
});
