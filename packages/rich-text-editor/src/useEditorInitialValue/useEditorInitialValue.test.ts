import { RICH_TEXT_TEST_DATA } from '@minddrop/rich-text';
import { renderHook } from '@minddrop/test-utils';
import { setup, cleanup } from '../test-utils';
import { useEditorInitialValue } from './useEditorInitialValue';

const { richTextDocument1, headingElement1, paragraphElement1 } =
  RICH_TEXT_TEST_DATA;

describe('useEditorInitialValue', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("returns document's the root level elements", () => {
    // Get the initial value
    const { result } = renderHook(() =>
      useEditorInitialValue(richTextDocument1.id),
    );

    // Initial value should be composed of the document's
    // root level elements ordered appropriately.
    expect(result.current).toEqual([headingElement1, paragraphElement1]);
  });
});
