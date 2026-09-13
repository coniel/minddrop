import { DesignElementConfig, Designs } from '@minddrop/designs-next';
import { i18n } from '@minddrop/i18n';
import { Properties } from '@minddrop/properties';
import { TextContentControls } from '@minddrop/ui-designs-next';
import { TextElement } from '../TextElement.types';
import { TextElementRenderer } from '../TextElementRenderer';

export const TextElementType = 'text';

// The lines of text at the default size a new text element holds
const DefaultLines = 2;

/**
 * Config for the text element: wrapping body text growing to its
 * content's height.
 */
export const TextElementConfig: DesignElementConfig<TextElement> = {
  type: TextElementType,
  label: 'designsNext.elements.text.label',
  icon: 'text',
  group: 'content',
  contentControls: TextContentControls,
  propertyTypes: Properties.constants.TextualTypes,
  suggestedPropertyTypes: ['text', 'title', 'select', 'url'],
  component: TextElementRenderer,
  defaultColumnSpan: 32,
  defaultRowSpan:
    Designs.resolveTextLineRowSpan(Designs.constants.DefaultFontSize) *
    DefaultLines,
  defaultContentFit: 'grow',
  resolveDefaults: resolvePlaceholderText,
  settingGroups: ['text'],
  resolveMinRowSpan: resolveLineRowSpan,
};

/**
 * Resolves the placeholder text a new text element starts with, so
 * it renders visibly.
 *
 * @returns The starter fields.
 */
function resolvePlaceholderText(): Partial<TextElement> {
  return { content: i18n.t('designsNext.elements.text.placeholder') };
}

/**
 * Resolves the rows one line of the element's text needs at its
 * size, the block's floor.
 *
 * @param element - The text element.
 * @returns The row span in grid units.
 */
function resolveLineRowSpan(element: TextElement): number {
  return Designs.resolveTextLineRowSpan(
    element.fontSize ?? Designs.constants.DefaultFontSize,
  );
}
