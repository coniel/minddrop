import { DesignElementConfig, Designs } from '@minddrop/designs-next';
import { resolveElementLineRowSpan } from '../../../utils';
import { NumberElement } from '../NumberElement.types';
import { NumberElementRenderer } from '../NumberElementRenderer';
import { NumberSettingsPanel } from '../NumberSettingsPanel';

// The element type the config registers under
export const NumberElementType = 'number';

/**
 * Config for the number element: the number property it maps to,
 * written in a chosen format.
 */
export const NumberElementConfig: DesignElementConfig<NumberElement> = {
  type: NumberElementType,
  label: 'designsNext.elements.number.label',
  icon: 'hash',
  group: 'content',
  propertyTypes: ['number'],
  component: NumberElementRenderer,
  defaultColumnSpan: 24,
  defaultRowSpan: Designs.resolveTextLineRowSpan(
    Designs.constants.DefaultFontSize,
  ),
  settingsPanel: NumberSettingsPanel,
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
