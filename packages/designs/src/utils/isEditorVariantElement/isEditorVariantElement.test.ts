import { describe, expect, it } from 'vitest';
import { DesignFixtures } from '../../test-utils';
import { isEditorVariantElement } from './isEditorVariantElement';

const { element_text_1, element_property_text_1 } = DesignFixtures;

describe('isEditorVariantElement', () => {
  it('returns true for a property element on an editor variant', () => {
    expect(
      isEditorVariantElement({ ...element_property_text_1, variant: 'field' }),
    ).toBe(true);
  });

  it('returns false for a property element on a display variant', () => {
    expect(
      isEditorVariantElement({ ...element_property_text_1, variant: 'short' }),
    ).toBe(false);
  });

  it('returns false for non-property elements', () => {
    expect(isEditorVariantElement(element_text_1)).toBe(false);
  });
});
