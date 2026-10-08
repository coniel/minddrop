import { DesignElementConfig, Designs } from '@minddrop/designs-next';
import { resolveElementLineRowSpan } from '../../../utils';
import { DateElement } from '../DateElement.types';
import { DateElementRenderer } from '../DateElementRenderer';
import { DateSettingsPanel } from '../DateSettingsPanel';

// The element type the config registers under
export const DateElementType = 'date';

/**
 * Config for the date element: the date property it maps to, formatted
 * in a chosen format.
 */
export const DateElementConfig: DesignElementConfig<DateElement> = {
  type: DateElementType,
  label: 'designsNext.elements.date.label',
  icon: 'calendar',
  group: 'content',
  propertyTypes: ['date', 'created', 'last-modified'],
  component: DateElementRenderer,
  defaultColumnSpan: 24,
  defaultRowSpan: Designs.resolveTextLineRowSpan(
    Designs.constants.DefaultFontSize,
  ),
  settingsPanel: DateSettingsPanel,
  settingControls: [
    'font',
    'font-size',
    'line-height',
    'font-weight',
    'text-align',
    'vertical-align',
    'text-color',
  ],
  resolveMinRowSpan: resolveElementLineRowSpan,
};
