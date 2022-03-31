import { RichTextDocumentNotFoundError } from '../errors';
import { setup, cleanup, richTextDocument1 } from '../test-utils';
import { getRichTextDocument } from './getRichTextDocument';

describe('getRichTextDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns a rich text document by ID', () => {
    // Get a rich text document
    const document = getRichTextDocument(richTextDocument1.id);

    // Should return the document
    expect(document).toEqual(richTextDocument1);
  });

  it('throws a `RichTextDocumentNotFoundError` if the document does not exist', () => {
    // Get a missing rich text document, should throw an error
    expect(() => getRichTextDocument('missing')).toThrowError(
      RichTextDocumentNotFoundError,
    );
  });
});
