import { PropertyElementConfig } from '../types';

// The style keys text presentation variants offer for editing,
// ported from the text value role
const TextEditableStyles = [
  'color',
  'textAlign',
  'textTransform',
  'italic',
  'truncate',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
];

/**
 * The text property element. Its presentation variants shift the
 * value between a single-line short value, multi-line long value,
 * secondary subtitle, fine-print caption and a quote.
 */
export const TextPropertyElementConfig: PropertyElementConfig = {
  propertyType: 'text',
  label: 'properties.text.name',
  icon: 'text',
  bindsPropertyTypes: ['text'],
  defaultVariant: 'short',
  variants: [
    {
      id: 'short',
      label: 'designs.propertyElements.variants.short',
      renderer: 'text',
      sample: 'designs.propertyElements.samples.short',
      styleCategory: 'typography',
      editableStyles: TextEditableStyles,
    },
    {
      id: 'long',
      label: 'designs.propertyElements.variants.long',
      renderer: 'text',
      sample: 'designs.propertyElements.samples.long',
      styleCategory: 'typography',
      editableStyles: TextEditableStyles,
    },
    {
      id: 'subtitle',
      label: 'designs.propertyElements.variants.subtitle',
      renderer: 'text',
      sample: 'designs.propertyElements.samples.subtitle',
      styleCategory: 'typography',
      // Subtitles never render italic, so the key is withheld
      editableStyles: TextEditableStyles.filter((key) => key !== 'italic'),
    },
    {
      id: 'caption',
      label: 'designs.propertyElements.variants.caption',
      renderer: 'text',
      sample: 'designs.propertyElements.samples.caption',
      styleCategory: 'typography',
      editableStyles: TextEditableStyles,
    },
    {
      id: 'quote',
      label: 'designs.propertyElements.variants.quote',
      renderer: 'text',
      sample: 'designs.propertyElements.samples.quote',
      styleCategory: 'typography',
      editableStyles: TextEditableStyles,
    },
  ],
};
