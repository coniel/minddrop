import { DesignElementConfig } from '@minddrop/designs-next';
import { i18n } from '@minddrop/i18n';
import { Properties } from '@minddrop/properties';
import { TextContentControls } from '@minddrop/ui-designs-next';
import { HeadingElement } from '../HeadingElement.types';
import { HeadingElementRenderer } from '../HeadingElementRenderer';

export const HeadingElementType = 'heading';

// The height of a new heading in grid units
const DefaultHeadingRowSpan = 6;

// The smallest heading height in grid units, below which the text
// is too small to read.
const MinHeadingRowSpan = 3;

/**
 * Config for the heading element: prominent text sized by its
 * block, whose height holds a line of it.
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
  defaultRowSpan: DefaultHeadingRowSpan,
  resolveDefaults: resolvePlaceholderText,
  settingGroups: ['text'],
  resolveMinRowSpan: () => MinHeadingRowSpan,
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
