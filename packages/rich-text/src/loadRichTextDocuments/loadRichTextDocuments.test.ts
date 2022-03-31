import { generateId } from '@minddrop/utils';
import {
  setup,
  cleanup,
  richTextDocument1,
  richTextDocument2,
  core,
} from '../test-utils';
import { getRichTextDocuments } from '../getRichTextDocuments';
import { loadRichTextDocuments } from './loadRichTextDocuments';
import { RichTextDocumentNotFoundError } from '../errors';

// The documents to load
const documents = [
  { ...richTextDocument1, id: generateId() },
  { ...richTextDocument2, id: generateId() },
];

describe('loadRichTextDocuments', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('loads the documents into the store', () => {
    // Load some documents
    loadRichTextDocuments(core, documents);

    // The documents should be in the store (should not throw
    // a `RichTextDocumentsNotFoundError`).
    expect(() =>
      getRichTextDocuments(documents.map((document) => document.id)),
    ).not.toThrowError(RichTextDocumentNotFoundError);
  });

  it('dispatches a `rich-text-documents:load` event', (done) => {
    // Listen to 'rich-text-documents:load' events
    core.addEventListener('rich-text-documents:load', (payload) => {
      // Payload data should be the loaded documents
      expect(payload.data).toEqual(documents);
      done();
    });

    // Load some documents
    loadRichTextDocuments(core, documents);
  });
});
