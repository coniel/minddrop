import { PropertyElementConfig } from '../types';

/**
 * The number property element. Number formatting is an
 * element-level setting rather than a presentation variant, so the
 * element offers a single plain variant.
 */
export const NumberPropertyElementConfig: PropertyElementConfig = {
  propertyType: 'number',
  label: 'properties.number.name',
  icon: 'hash',
  bindsPropertyTypes: ['number'],
  defaultVariant: 'plain',
  variants: [
    {
      id: 'plain',
      label: 'designs.propertyElements.variants.plain',
      renderer: 'number',
      styleCategory: 'typography',
    },
  ],
};
