import { renderHook } from '@minddrop/test-utils';
import { setup, cleanup, richTextDocument1 } from '../test-utils';
import { useRichTextDocument } from './useRichTextDocument';

describe('useRichTextDocument', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns a rich text document by ID', () => {
    // Get an document
    const { result } = renderHook(() =>
      useRichTextDocument(richTextDocument1.id),
    );

    // Should return the document
    expect(result.current).toEqual(richTextDocument1);
  });

  it('returns `null` if the document does not exist', () => {
    // Get an document which does not exist
    const { result } = renderHook(() => useRichTextDocument('missing'));

    // Should return null
    expect(result.current).toBeNull();
  });
});
