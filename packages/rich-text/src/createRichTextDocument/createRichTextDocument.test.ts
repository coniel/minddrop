import {
  RichTextDocumentNotFoundError,
  RichTextDocumentValidationError,
  RichTextElementNotFoundError,
} from '../errors';
import { setup, cleanup, core } from '../test-utils';
import { getRichTextDocument } from '../getRichTextDocument';
import { createRichTextDocument } from './createRichTextDocument';

describe('createRichTextDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('throws if the data contains `parents`', () => {
    // Attempt to create an document with a `parents` value in data.
    // Should throw a `RichTextDocumentValidationError`.
    expect(() =>
      createRichTextDocument(core, {
        // @ts-ignore
        parents: [],
      }),
    ).toThrowError(RichTextDocumentValidationError);
  });

  it('validates the document', () => {
    // Attempt to create a document with a missing child. Should
    // throw a `RichTextElementNotFoundError`.
    expect(() =>
      createRichTextDocument(core, { children: ['missing'] }),
    ).toThrowError(RichTextElementNotFoundError);
  });

  it('returns the new document', () => {
    // Create a new document
    const document = createRichTextDocument(core, { revision: 'doc-rev' });

    // Should return the new document
    expect(document.revision).toEqual('doc-rev');
  });

  it('adds the document to the rich text store', () => {
    // Create a new document
    const document = createRichTextDocument(core);

    // Document should be added to the store.
    expect(() => getRichTextDocument(document.id)).not.toThrowError(
      RichTextDocumentNotFoundError,
    );
  });

  it('dispatches a `rich-text-documents:create` event', (done) => {
    // Listen to 'rich-text-documents:create' events
    core.addEventListener('rich-text-documents:create', (payload) => {
      // Get the created document
      const document = getRichTextDocument(payload.data.id);

      // Payload data should be the new document
      expect(payload.data).toEqual(document);
      done();
    });

    // Create a new document
    createRichTextDocument(core);
  });
});
