import { RichTextDocumentNotFoundError } from '../errors';
import { getRichTextDocument } from '../getRichTextDocument';
import { setup, cleanup, core, richTextDocument1 } from '../test-utils';
import { setRevisionInRichTextDocument } from './setRevisionInRichTextDocument';

describe('setRevisionInRichTextDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the document does not exist', () => {
    // Attempt to set the revision on a document which does not exist.
    // Should throw a `RichTextDocumentNotFoundError`.
    expect(() =>
      setRevisionInRichTextDocument(core, 'missing', 'new-revision'),
    ).toThrowError(RichTextDocumentNotFoundError);
  });

  it('sets the revision on the document', () => {
    // Set a new revision
    setRevisionInRichTextDocument(
      core,
      richTextDocument1.id,
      'new-revision-id',
    );

    // Get the updated document
    const document = getRichTextDocument(richTextDocument1.id);

    // Document should have the new revision
    expect(document.revision).toBe('new-revision-id');
  });

  it('returns the updated document', () => {
    // Set a new revision
    const document = setRevisionInRichTextDocument(
      core,
      richTextDocument1.id,
      'new-revision-id',
    );

    // Should return the updated document
    expect(document.revision).toBe('new-revision-id');
  });
});
