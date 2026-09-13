import {
  DesignElementConfig,
  Designs,
  FontWeight,
} from '@minddrop/designs-next';
import { i18n } from '@minddrop/i18n';
import { Properties } from '@minddrop/properties';
import { TextContentControls } from '@minddrop/ui-designs-next';
import { resolveElementLineRowSpan } from '../../../utils';
import { TextElementRenderer } from '../../TextElement';
import { HeadingElement } from '../HeadingElement.types';

export const HeadingElementType = 'heading';

// The size and weight a new heading is set in
const DefaultHeadingFontSize = 24;
const DefaultHeadingFontWeight: FontWeight = 600;

/**
 * Config for the heading element: a text element seeded with a
 * prominent size and weight, holding a line of it.
 */
export const HeadingElementConfig: DesignElementConfig<HeadingElement> = {
  type: HeadingElementType,
  label: 'designsNext.elements.heading.label',
  icon: 'heading',
  group: 'content',
  contentControls: TextContentControls,
  propertyTypes: Properties.constants.TextualTypes,
  suggestedPropertyTypes: ['title', 'text'],
  component: TextElementRenderer,
  defaultColumnSpan: 48,
  defaultRowSpan: Designs.resolveTextLineRowSpan(DefaultHeadingFontSize),
  resolveDefaults: resolveHeadingDefaults,
  settingGroups: ['text'],
  resolveMinRowSpan: resolveElementLineRowSpan,
};

/**
 * Resolves the fields a new heading starts with: placeholder text so
 * it renders visibly, and the size and weight setting it apart from
 * body text.
 *
 * @returns The starter fields.
 */
function resolveHeadingDefaults(): Partial<HeadingElement> {
  return {
    content: i18n.t('designsNext.elements.heading.placeholder'),
    fontSize: DefaultHeadingFontSize,
    fontWeight: DefaultHeadingFontWeight,
  };
}
