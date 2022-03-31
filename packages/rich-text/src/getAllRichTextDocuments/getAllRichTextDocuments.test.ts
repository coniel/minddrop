import { setup, cleanup } from '../test-utils';
import { useRichTextStore } from '../useRichTextStore';
import { getAllRichTextDocuments } from './getAllRichTextDocuments';

describe('getRichAllTextDocuments', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns all rich text documents', () => {
    // Get all rich text documents
    const documents = getAllRichTextDocuments();

    // Should contain all the documents
    expect(documents).toEqual(useRichTextStore.getState().documents);
  });
});
