import { DesignElementConfig } from '@minddrop/designs-next';

export const TextElementType = 'text';

// The text line height in grid units, matching its CSS
export const TextLineHeightUnits = 5;

/**
 * Config for the text element: wrapping body text growing to its
 * content's height.
 */
export const TextElementConfig: DesignElementConfig = {
  type: TextElementType,
  label: 'designsNext.elements.text.label',
  icon: 'text',
  group: 'content',
  defaultColumnSpan: 32,
  defaultRowSpan: TextLineHeightUnits * 2,
  defaultNaturalHeight: true,
  resolveMinRowSpan: () => TextLineHeightUnits,
  resolveRowSpanStep: () => TextLineHeightUnits,
};
