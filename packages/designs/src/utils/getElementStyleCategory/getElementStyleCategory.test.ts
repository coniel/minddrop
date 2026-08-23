import { describe, expect, it } from 'vitest';
import { PropertyElement } from '../../design-element-configs';
import { DesignFixtures } from '../../test-utils';
import { getElementStyleCategory } from './getElementStyleCategory';

const { element_text_1, element_container_1, element_property_text_1 } =
  DesignFixtures;

describe('getElementStyleCategory', () => {
  it('resolves a property element to its variant category', () => {
    expect(getElementStyleCategory(element_property_text_1)).toBe('typography');
  });

  it('resolves other elements to their element type category', () => {
    expect(getElementStyleCategory(element_text_1)).toBe('typography');
    expect(getElementStyleCategory(element_container_1)).toBe('container');
  });

  it('falls back to the base config category for property types without a config', () => {
    const element = {
      ...element_property_text_1,
      propertyType: 'toggle',
    } as unknown as PropertyElement;

    expect(getElementStyleCategory(element)).toBe('typography');
  });
});
