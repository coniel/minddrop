import {
  RichTextDocumentNotFoundError,
  RichTextDocumentValidationError,
  RichTextElementNotFoundError,
} from '../errors';
import {
  setup,
  cleanup,
  core,
  headingElement1,
  paragraphElement1,
} from '../test-utils';
import { getRichTextDocument } from '../getRichTextDocument';
import { createRichTextDocument } from './createRichTextDocument';
import { ParentReferences } from '@minddrop/core';
import { getRichTextElements } from '../getRichTextElements';
import { contains } from '@minddrop/utils';

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

  it('adds the document as a parent on its child elements', () => {
    // Create a new document
    const document = createRichTextDocument(core, {
      children: [headingElement1.id, paragraphElement1.id],
    });

    // The document's parent reference
    const parentReference = ParentReferences.generate(
      'rich-text-document',
      document.id,
    );

    // Get the updated child elements
    const elements = getRichTextElements([
      headingElement1.id,
      paragraphElement1.id,
    ]);

    // Elements should have the document as a parent
    expect(
      contains(elements[headingElement1.id].parents, [parentReference]),
    ).toBeTruthy();
    expect(
      contains(elements[paragraphElement1.id].parents, [parentReference]),
    ).toBeTruthy();
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
