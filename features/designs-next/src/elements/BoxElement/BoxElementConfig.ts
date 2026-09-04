import { BoxElementType, DesignElementConfig } from '@minddrop/designs-next';

/**
 * Config for the decorative box element, used as a backdrop or
 * visual accent behind other elements.
 */
export const BoxElementConfig: DesignElementConfig = {
  type: BoxElementType,
  label: 'designsNext.elements.box.label',
  icon: 'square',
  group: 'layout',
  defaultColumnSpan: 12,
  defaultRowSpan: 8,
};
