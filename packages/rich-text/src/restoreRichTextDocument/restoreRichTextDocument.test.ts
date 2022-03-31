import { deleteRichTextDocument } from '../deleteRichTextDocument';
import { RichTextDocumentNotFoundError } from '../errors';
import { getRichTextDocument } from '../getRichTextDocument';
import { setup, cleanup, core, richTextDocument1 } from '../test-utils';
import { restoreRichTextDocument } from './restoreRichTextDocument';

describe('restoreRichTextDocument', () => {
  beforeEach(() => {
    setup();

    // Delete a document
    deleteRichTextDocument(core, richTextDocument1.id);
  });

  afterEach(cleanup);

  it('removes the `deleted` and `deleted` at properties', () => {
    // Restore a deleted document
    restoreRichTextDocument(core, richTextDocument1.id);

    // Get the restored document
    const document = getRichTextDocument(richTextDocument1.id);

    // Should no longer contain the `deleted` property
    expect(document.deleted).toBeUndefined();
    // Should no longer contain the `deletedAt` property
    expect(document.deletedAt).toBeUndefined();
  });

  it('returns the restored document', () => {
    // restore a deleted a document
    const document = restoreRichTextDocument(core, richTextDocument1.id);

    // Should return the restored document
    expect(document.deleted).toBeUndefined();
  });

  it('throws if document does not exist', () => {
    // Attempt to restore a non-existent document. Should
    // throw a `RichTextDocumentNotFoundError`.
    expect(() => restoreRichTextDocument(core, 'missing')).toThrowError(
      RichTextDocumentNotFoundError,
    );
  });

  it('dispatches a `rich-text-documents:restore` event', (done) => {
    // Listen to 'rich-text-documents:restore' events
    core.addEventListener('rich-text-documents:restore', (payload) => {
      // Get the restored document
      const document = getRichTextDocument(richTextDocument1.id);

      // Payload data should be the restored document
      expect(payload.data).toEqual(document);
      done();
    });

    // Restore a deleted document
    restoreRichTextDocument(core, richTextDocument1.id);
  });
});
