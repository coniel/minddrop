import { BoxElementType, DesignElementConfig } from '@minddrop/designs-next';
import { BoxElement } from './BoxElement.types';
import { BoxElementRenderer } from './BoxElementRenderer';

/**
 * Config for the decorative box element, used as a backdrop or
 * visual accent behind other elements.
 */
export const BoxElementConfig: DesignElementConfig<BoxElement> = {
  type: BoxElementType,
  label: 'designsNext.elements.box.label',
  icon: 'square',
  group: 'layout',
  component: BoxElementRenderer,
  defaultColumnSpan: 12,
  defaultRowSpan: 8,
  settingGroups: ['background'],
};
