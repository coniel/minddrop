import { setup, cleanup, core, richTextDocument1 } from '../test-utils';
import { getRichTextDocument } from '../getRichTextDocument';
import { deleteRichTextDocument } from './deleteRichTextDocument';
import { RichTextDocumentNotFoundError } from '../errors';

describe('deleteRichTextDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('sets the `deleted` and `deleted` at properties', () => {
    // Delete a document
    deleteRichTextDocument(core, richTextDocument1.id);

    // Get the deleted document
    const document = getRichTextDocument(richTextDocument1.id);

    // Should have `deleted` set to true
    expect(document.deleted).toBe(true);
    // Should have `deletedAt` timestamp set
    expect(document.deletedAt).toBeInstanceOf(Date);
  });

  it('returns the updated document', () => {
    // Delete a document
    const document = deleteRichTextDocument(core, richTextDocument1.id);

    // Should return the updated document
    expect(document.deleted).toBe(true);
  });

  it('throws if document does not exist', () => {
    // Attempt to delete a non-existent document. Should
    // throw a `RichTextDocumentNotFoundError`.
    expect(() => deleteRichTextDocument(core, 'missing')).toThrowError(
      RichTextDocumentNotFoundError,
    );
  });

  it('dispatches a `rich-text-documents:delete` event', (done) => {
    // Listen to 'rich-text-documents:delete' events
    core.addEventListener('rich-text-documents:delete', (payload) => {
      // Get the updated document
      const document = getRichTextDocument(richTextDocument1.id);

      // Payload data should be the deleted document
      expect(payload.data).toEqual(document);
      done();
    });

    // Delete a document
    deleteRichTextDocument(core, richTextDocument1.id);
  });
});
