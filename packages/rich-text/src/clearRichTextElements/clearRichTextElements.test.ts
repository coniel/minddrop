import { setup, cleanup } from '../test-utils';
import { useRichTextStore } from '../useRichTextStore';
import { clearRichTextElements } from './clearRichTextElements';

describe('clearRichTextElements', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('clears rich text elements from the store', () => {
    // Clear elements
    clearRichTextElements();

    // Store should no longer contain any elements
    expect(useRichTextStore.getState().elements).toEqual({});
  });
});
