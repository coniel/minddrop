import { describe, expect, it } from 'vitest';
import { PropertyElement } from '../../design-element-configs';
import { DatePropertyElementConfig } from '../../property-element-configs';
import { DesignFixtures } from '../../test-utils';
import { getElementCompatiblePropertyTypes } from './getElementCompatiblePropertyTypes';

const { element_text_1, element_property_date_1 } = DesignFixtures;

describe('getElementCompatiblePropertyTypes', () => {
  it('resolves a property element to its config binding types', () => {
    expect(getElementCompatiblePropertyTypes(element_property_date_1)).toEqual(
      DatePropertyElementConfig.bindsPropertyTypes,
    );
  });

  it('resolves other elements to their element type compatible types', () => {
    expect(getElementCompatiblePropertyTypes(element_text_1)).toEqual([
      'title',
      'text',
      'select',
    ]);
  });

  it('resolves nothing for property types without a config', () => {
    const element = {
      ...element_property_date_1,
      propertyType: 'toggle',
    } as unknown as PropertyElement;

    expect(getElementCompatiblePropertyTypes(element)).toEqual([]);
  });
});
