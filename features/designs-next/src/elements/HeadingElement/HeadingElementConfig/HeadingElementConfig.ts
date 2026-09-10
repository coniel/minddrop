import { DesignElementConfig } from '@minddrop/designs-next';
import { i18n } from '@minddrop/i18n';
import { Properties } from '@minddrop/properties';
import { TextContentControls } from '@minddrop/ui-designs-next';
import { HeadingElement, HeadingLevel } from '../HeadingElement.types';
import { HeadingElementRenderer } from '../HeadingElementRenderer';
import { HeadingSettingsControls } from '../HeadingSettingsControls';

export const HeadingElementType = 'heading';

/**
 * The heading level applied when an element has no level setting.
 */
export const DefaultHeadingLevel: HeadingLevel = 2;

// Line height per heading level in grid units, matching the CSS
export const HeadingLineHeightUnits: Record<HeadingLevel, number> = {
  1: 8,
  2: 6,
  3: 5,
};

/**
 * Config for the heading element: prominent text whose block height
 * acts as a max-lines setting, with the level setting choosing its
 * typography.
 */
export const HeadingElementConfig: DesignElementConfig<HeadingElement> = {
  type: HeadingElementType,
  label: 'designsNext.elements.heading.label',
  icon: 'heading',
  group: 'content',
  contentControls: TextContentControls,
  propertyTypes: Properties.constants.TextualTypes,
  suggestedPropertyTypes: ['title', 'text'],
  component: HeadingElementRenderer,
  defaultColumnSpan: 24,
  defaultRowSpan: HeadingLineHeightUnits[DefaultHeadingLevel],
  resolveDefaults: resolvePlaceholderText,
  settingGroups: ['text'],
  settingsControls: HeadingSettingsControls,
  resolveMinRowSpan: resolveLineHeight,
  resolveRowSpanStep: resolveLineHeight,
};

/**
 * Resolves the placeholder text a new heading starts with, so it
 * renders visibly.
 *
 * @returns The starter fields.
 */
function resolvePlaceholderText(): Partial<HeadingElement> {
  return { content: i18n.t('designsNext.elements.heading.placeholder') };
}

/**
 * Resolves the line height of the element's heading level in grid
 * units.
 *
 * @param element - The heading element.
 * @returns The line height in grid units.
 */
function resolveLineHeight(element: HeadingElement): number {
  return HeadingLineHeightUnits[element.level ?? DefaultHeadingLevel];
}
