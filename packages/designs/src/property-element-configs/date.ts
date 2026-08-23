import { PropertyElementConfig } from '../types';

/**
 * The date property element. Also renders the created and
 * last-modified metadata properties, which carry no palette entry
 * of their own. Date formatting is an element-level setting rather
 * than a presentation variant, so the element offers a single
 * plain variant.
 */
export const DatePropertyElementConfig: PropertyElementConfig = {
  propertyType: 'date',
  label: 'properties.date.name',
  icon: 'calendar',
  bindsPropertyTypes: ['date', 'created', 'last-modified'],
  defaultVariant: 'plain',
  variants: [
    {
      id: 'plain',
      label: 'designs.propertyElements.variants.plain',
      renderer: 'date',
      styleCategory: 'typography',
    },
  ],
};
