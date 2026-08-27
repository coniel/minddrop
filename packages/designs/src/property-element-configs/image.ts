import { PropertyElementConfig } from '../types';

/**
 * The image property element. Its presentation variants place the
 * image as a picture in the layout, or open it in a zoomable
 * viewer filling the space it is given.
 */
export const ImagePropertyElementConfig: PropertyElementConfig = {
  propertyType: 'image',
  label: 'properties.image.name',
  icon: 'image',
  bindsPropertyTypes: ['image'],
  defaultVariant: 'image',
  context: { designTypes: ['database'] },
  variants: [
    {
      id: 'image',
      label: 'designs.propertyElements.variants.image',
      description: 'designs.propertyElements.descriptions.image',
      renderer: 'image',
      styleCategory: 'image',
    },
    {
      id: 'viewer',
      label: 'designs.propertyElements.variants.viewer',
      description: 'designs.propertyElements.descriptions.viewer',
      renderer: 'image-viewer',
      styleCategory: 'embed',
    },
  ],
};
