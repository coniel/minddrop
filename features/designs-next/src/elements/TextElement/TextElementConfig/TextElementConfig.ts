import { DesignElementConfig, Designs } from '@minddrop/designs-next';
import { Properties } from '@minddrop/properties';
import { TextContentControls } from '@minddrop/ui-designs-next';
import {
  resolveElementLineRowSpan,
  resolvePlaceholderContent,
} from '../../../utils';
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
  resolveDefaults: () =>
    resolvePlaceholderContent('designsNext.elements.text.placeholder'),
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
