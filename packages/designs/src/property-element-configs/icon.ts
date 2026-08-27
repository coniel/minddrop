import { PropertyElementConfig } from '../types';

/**
 * The icon property element. An icon is a single glyph however it
 * is placed, so the element offers a single plain variant; the box
 * drawn around it is styling rather than a presentation of its own.
 */
export const IconPropertyElementConfig: PropertyElementConfig = {
  propertyType: 'icon',
  label: 'properties.icon.name',
  icon: 'smile',
  bindsPropertyTypes: ['icon'],
  defaultVariant: 'plain',
  context: { designTypes: ['database'] },
  variants: [
    {
      id: 'plain',
      label: 'designs.propertyElements.variants.plain',
      renderer: 'icon',
      styleCategory: 'icon',
    },
  ],
};
