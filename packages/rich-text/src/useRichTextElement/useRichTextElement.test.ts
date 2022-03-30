import { renderHook } from '@minddrop/test-utils';
import { setup, cleanup, headingElement1 } from '../test-utils';
import { useRichTextElement } from './useRichTextElement';

describe('useRichTextElement', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns a rich text element by ID', () => {
    // Get an element
    const { result } = renderHook(() => useRichTextElement(headingElement1.id));

    // Should return the element
    expect(result.current).toEqual(headingElement1);
  });

  it('returns `null` if the element does not exist', () => {
    // Get an element which does not exist
    const { result } = renderHook(() => useRichTextElement('missing'));

    // Should return null
    expect(result.current).toBeNull();
  });
});
