import { RichTextDocumentNotFoundError } from '../errors';
import { getRichTextDocument } from '../getRichTextDocument';
import { setup, cleanup, core, richTextDocument1 } from '../test-utils';
import { permanentlyDeleteRichTextDocument } from './permanentlyDeleteRichTextDocument';

describe('permanentlyDeleteRichTextDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the document does not exist', () => {
    // Attempt to permanently delete a non-existent document.
    // Should throw a `RichTextDocumentNotFoundError`.
    expect(() =>
      permanentlyDeleteRichTextDocument(core, 'missing'),
    ).toThrowError(RichTextDocumentNotFoundError);
  });

  it('removes the document from the rich text store', () => {
    // Permanently delete a document
    permanentlyDeleteRichTextDocument(core, richTextDocument1.id);

    // Attempt to get the deleted document, should throw a
    // `RichTextDocumentNotFoundError`.
    expect(() => getRichTextDocument(richTextDocument1.id)).toThrowError(
      RichTextDocumentNotFoundError,
    );
  });

  it('returns the deleted document', () => {
    // Permanently delete a document
    const document = permanentlyDeleteRichTextDocument(
      core,
      richTextDocument1.id,
    );

    // Should return the document
    expect(document).toEqual(richTextDocument1);
  });

  it('dispatches a `rich-text-documents:delete-permanently` event', (done) => {
    // Listen to 'rich-text-documents:delete-permanently' events
    core.addEventListener(
      'rich-text-documents:delete-permanently',
      (payload) => {
        // Payload data should be the deleted document
        expect(payload.data).toEqual(richTextDocument1);
        done();
      },
    );

    // Permanently delete a docuemnt
    permanentlyDeleteRichTextDocument(core, richTextDocument1.id);
  });
});
