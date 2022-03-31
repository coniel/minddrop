import { mapById } from '@minddrop/utils';
import { RichTextDocumentNotFoundError } from '../errors';
import {
  setup,
  cleanup,
  richTextDocument1,
  richTextDocument2,
} from '../test-utils';
import { getRichTextDocuments } from './getRichTextDocuments';

describe('getRichTextDocuments', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns a RichTextDocumentMap of requested documents', () => {
    // Get the documents
    const documents = getRichTextDocuments([
      richTextDocument1.id,
      richTextDocument2.id,
    ]);

    // Should be a map of the requested documents
    expect(documents).toEqual(mapById([richTextDocument1, richTextDocument2]));
  });

  it('throws a `RichTextDocumentNotFoundError` if any of the documents do no exist', () => {
    // Get rich text documents, including some non existent ones.
    // Should throw a `RichTextDocumentNotFoundError`.
    expect(() =>
      getRichTextDocuments([richTextDocument1.id, 'missing-1', 'missing-2']),
    ).toThrowError(RichTextDocumentNotFoundError);
  });
});
