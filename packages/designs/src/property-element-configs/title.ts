import { PropertyElementConfig } from '../types';
import { TypographyEditableStyles } from './typographyEditableStyles';

// The style keys a title size offers for editing. Titles never
// render italic, so the key is withheld.
const TitleEditableStyles = TypographyEditableStyles.filter(
  (key) => key !== 'italic',
);

/**
 * The title property element: the entry's primary heading. Its
 * presentation variants are the three sizes it can be set at, each
 * sized to the layout it is placed in.
 */
export const TitlePropertyElementConfig: PropertyElementConfig = {
  propertyType: 'title',
  label: 'properties.title.name',
  icon: 'type',
  bindsPropertyTypes: ['title'],
  defaultVariant: 'md',
  variants: [
    {
      id: 'sm',
      label: 'designs.propertyElements.variants.sm',
      renderer: 'text',
      sample: 'designs.propertyElements.samples.title',
      styleCategory: 'typography',
      editableStyles: TitleEditableStyles,
    },
    {
      id: 'md',
      label: 'designs.propertyElements.variants.md',
      renderer: 'text',
      sample: 'designs.propertyElements.samples.title',
      styleCategory: 'typography',
      editableStyles: TitleEditableStyles,
    },
    {
      id: 'lg',
      label: 'designs.propertyElements.variants.lg',
      renderer: 'text',
      sample: 'designs.propertyElements.samples.title',
      styleCategory: 'typography',
      editableStyles: TitleEditableStyles,
    },
  ],
};
