import { setup, cleanup } from '../test-utils';
import { useRichTextStore } from '../useRichTextStore';
import { clearRegisteredRichTextElementTypes } from './clearRegisteredRichTextElementTypes';

describe('clearRegisteredRichTextElementTypes', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('clears registered rich text element types from the store', () => {
    // Clear registered element types
    clearRegisteredRichTextElementTypes();

    // Store should no longer contain any element configs
    expect(useRichTextStore.getState().elementConfigs).toEqual({});
  });
});
