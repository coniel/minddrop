import { PropertyElementConfig } from '../types';
import { TypographyEditableStyles } from './typographyEditableStyles';

// The style keys the badges presentations offer for editing. A
// chip's fill and label colour come from its select option, and its
// size, rounding and padding are the chip shape the variant sets,
// so only the label's weight and case are left to style. The label
// and icon keys enable the property chrome sections.
const BadgesEditableStyles = [
  'fontWeight',
  'textTransform',
  'label',
  'icon',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
];

/**
 * The select property element. Its presentation variants render
 * the selected options as coloured chips at one of three sizes, or
 * as a plain run of text.
 */
export const SelectPropertyElementConfig: PropertyElementConfig = {
  propertyType: 'select',
  label: 'properties.select.name',
  icon: 'rectangle-ellipsis',
  bindsPropertyTypes: ['select'],
  defaultVariant: 'badges',
  context: { designTypes: ['database'] },
  variants: [
    {
      id: 'badges-sm',
      label: 'designs.propertyElements.variants.badges-sm',
      renderer: 'badges',
      sample: 'designs.propertyElements.samples.select',
      styleCategory: 'badge',
      editableStyles: BadgesEditableStyles,
    },
    {
      id: 'badges',
      label: 'designs.propertyElements.variants.badges',
      renderer: 'badges',
      sample: 'designs.propertyElements.samples.select',
      styleCategory: 'badge',
      editableStyles: BadgesEditableStyles,
    },
    {
      id: 'badges-lg',
      label: 'designs.propertyElements.variants.badges-lg',
      renderer: 'badges',
      sample: 'designs.propertyElements.samples.select',
      styleCategory: 'badge',
      editableStyles: BadgesEditableStyles,
    },
    {
      id: 'text',
      label: 'designs.propertyElements.variants.text',
      renderer: 'text',
      sample: 'designs.propertyElements.samples.select',
      styleCategory: 'typography',
      editableStyles: TypographyEditableStyles,
    },
  ],
};
