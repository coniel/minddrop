import { setup, cleanup } from '../test-utils';
import { useRichTextStore } from '../useRichTextStore';
import { clearRichTextDocuments } from './clearRichTextDocuments';

describe('clearRichTextDocuments', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('clears rich text documents from the store', () => {
    // Clear documents
    clearRichTextDocuments();

    // Store should no longer contain any documents
    expect(useRichTextStore.getState().documents).toEqual({});
  });
});
