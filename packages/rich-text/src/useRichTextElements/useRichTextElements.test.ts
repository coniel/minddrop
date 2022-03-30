import { renderHook } from '@minddrop/test-utils';
import { mapById } from '@minddrop/utils';
import {
  setup,
  cleanup,
  headingElement1,
  paragraphElement1,
} from '../test-utils';
import { useRichTextElements } from './useRichTextElements';

describe('useRichTextElements', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('returns the requested elements as a map', () => {
    // Get elements
    const { result } = renderHook(() =>
      useRichTextElements([headingElement1.id, paragraphElement1.id]),
    );

    // Should return the elements as a map
    expect(result.current).toEqual(
      mapById([headingElement1, paragraphElement1]),
    );
  });

  it('omits missing elements', () => {
    // Get elements, including one which does not exist
    const { result } = renderHook(() =>
      useRichTextElements([headingElement1.id, 'missing']),
    );

    // Should omit the missing element from the map
    expect(result.current).toEqual(mapById([headingElement1]));
  });

  it('filters the returned elements', () => {
    // Get elements and filter them to only include elements
    // of type 'heading-1'.
    const { result } = renderHook(() =>
      useRichTextElements([headingElement1.id, paragraphElement1.id], {
        type: [headingElement1.type],
      }),
    );

    // Should filter the returned elements
    expect(result.current).toEqual(mapById([headingElement1]));
  });
});
