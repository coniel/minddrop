import { DesignElementConfig } from '@minddrop/designs-next';

export const HeadingElementType = 'heading';

// The heading's line height in grid units, matching its CSS
export const HeadingLineHeightUnits = 6;

/**
 * Config for the heading element: prominent text whose block height
 * acts as a max-lines setting.
 */
export const HeadingElementConfig: DesignElementConfig = {
  type: HeadingElementType,
  label: 'designsNext.elements.heading.label',
  icon: 'heading',
  group: 'content',
  defaultColumnSpan: 24,
  defaultRowSpan: HeadingLineHeightUnits,
  resolveMinRowSpan: () => HeadingLineHeightUnits,
  resolveRowSpanStep: () => HeadingLineHeightUnits,
};
