import { renderHook } from '@minddrop/test-utils';
import { registerRichTextElementType } from '../registerRichTextElementType';
import {
  cleanup,
  core,
  headingElementConfig,
  paragraphElementConfig,
  linkElementConfig,
} from '../test-utils';
import { useRichTextElementConfigs } from './useRichTextElementConfigs';

describe('useRichTextElementConfigs', () => {
  // Clear registered element configs
  beforeEach(cleanup);

  afterEach(cleanup);

  it('returns rich text element configs in registration order', () => {
    // Register rich text element types
    registerRichTextElementType(core, headingElementConfig);
    registerRichTextElementType(core, paragraphElementConfig);
    registerRichTextElementType(core, linkElementConfig);

    // Get the registered configs
    const { result } = renderHook(() => useRichTextElementConfigs());

    // Should return the configs in the order in which
    // they were registered.
    expect(result.current).toEqual([
      headingElementConfig,
      paragraphElementConfig,
      linkElementConfig,
    ]);
  });
});
