import { DesignElementConfig, Designs } from '@minddrop/designs-next';
import { i18n } from '@minddrop/i18n';
import { Properties } from '@minddrop/properties';
import { TextContentControls } from '@minddrop/ui-designs-next';
import { resolveElementLineRowSpan } from '../../../utils';
import { LabelElement } from '../LabelElement.types';
import { LabelElementRenderer } from '../LabelElementRenderer';

export const LabelElementType = 'label';

// The width a new label takes, in grid units
const DefaultColumnSpan = 24;

/**
 * Config for the label element: a line naming the property it maps
 * to.
 */
export const LabelElementConfig: DesignElementConfig<LabelElement> = {
  type: LabelElementType,
  label: 'designsNext.elements.label.label',
  icon: 'tag',
  group: 'content',
  contentControls: TextContentControls,
  propertyTypes: Properties.constants.AllTypes,
  component: LabelElementRenderer,
  defaultColumnSpan: DefaultColumnSpan,
  defaultRowSpan: Designs.resolveTextLineRowSpan(
    Designs.constants.DefaultFontSize,
  ),
  resolveDefaults: resolvePlaceholderText,
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

/**
 * Resolves the placeholder text a new label starts with, so it
 * renders visibly while it maps to no property.
 *
 * @returns The starter fields.
 */
function resolvePlaceholderText(): Partial<LabelElement> {
  return { content: i18n.t('designsNext.elements.label.placeholder') };
}
