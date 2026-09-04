import { DesignElementConfig } from '@minddrop/designs-next';
import { HeadingElement, HeadingLevel } from './HeadingElement.types';
import { HeadingElementRenderer } from './HeadingElementRenderer';
import { HeadingSettingsMenu } from './HeadingSettingsMenu';

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
  component: HeadingElementRenderer,
  defaultColumnSpan: 24,
  defaultRowSpan: HeadingLineHeightUnits[DefaultHeadingLevel],
  settingGroups: ['text'],
  settingsMenu: HeadingSettingsMenu,
  resolveMinRowSpan: resolveLineHeight,
  resolveRowSpanStep: resolveLineHeight,
};

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
