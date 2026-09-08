import { DesignElementConfig } from '@minddrop/designs-next';
import { i18n } from '@minddrop/i18n';
import { TextElement } from '../TextElement.types';
import { TextElementRenderer } from '../TextElementRenderer';

export const TextElementType = 'text';

// The text line height in grid units, matching its CSS
export const TextLineHeightUnits = 5;

/**
 * Config for the text element: wrapping body text growing to its
 * content's height.
 */
export const TextElementConfig: DesignElementConfig<TextElement> = {
  type: TextElementType,
  label: 'designsNext.elements.text.label',
  icon: 'text',
  group: 'content',
  component: TextElementRenderer,
  defaultColumnSpan: 32,
  defaultRowSpan: TextLineHeightUnits * 2,
  defaultNaturalHeight: true,
  resolveDefaults: resolvePlaceholderText,
  settingGroups: ['text'],
  resolveMinRowSpan: () => TextLineHeightUnits,
  resolveRowSpanStep: () => TextLineHeightUnits,
};

/**
 * Resolves the placeholder text a new text element starts with, so
 * it renders visibly.
 *
 * @returns The starter fields.
 */
function resolvePlaceholderText(): Partial<TextElement> {
  return { text: i18n.t('designsNext.elements.text.placeholder') };
}
