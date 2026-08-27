import { describe, expect, it } from 'vitest';
import { DesignFixtures } from '../../test-utils';
import { supportsPropertyChrome } from './supportsPropertyChrome';

const {
  element_text_1,
  element_property_text_1,
  element_property_number_1,
  element_property_select_1,
  element_property_url_1,
  element_property_image_1,
  element_property_icon_1,
} = DesignFixtures;

describe('supportsPropertyChrome', () => {
  it('returns true for typography variants', () => {
    expect(supportsPropertyChrome(element_property_text_1)).toBe(true);
    expect(supportsPropertyChrome(element_property_number_1)).toBe(true);
  });

  it('returns true for field variants', () => {
    expect(
      supportsPropertyChrome({ ...element_property_text_1, variant: 'field' }),
    ).toBe(true);
  });

  it('returns true for badge variants', () => {
    expect(
      supportsPropertyChrome({
        ...element_property_select_1,
        variant: 'badges',
      }),
    ).toBe(true);
  });

  it('returns false for non-value categories', () => {
    expect(
      supportsPropertyChrome({ ...element_property_url_1, variant: 'webview' }),
    ).toBe(false);
    expect(supportsPropertyChrome(element_property_image_1)).toBe(false);
    expect(supportsPropertyChrome(element_property_icon_1)).toBe(false);
  });

  it('returns false for non-property elements', () => {
    expect(supportsPropertyChrome(element_text_1)).toBe(false);
  });
});
