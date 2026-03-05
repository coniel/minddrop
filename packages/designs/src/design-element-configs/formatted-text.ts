import { DefaultTextElementStyle, TextElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';
import { generateLoremIpsum } from './placeholder-generators';

export interface FormattedTextElement extends DesignElementBase {
  type: 'formatted-text';

  /**
   * The element style.
   */
  style: TextElementStyle;

  /**
   * Placeholder text displayed when the element has no content.
   */
  placeholder?: string;
}

export const FormattedTextElementConfig: DesignElementConfig = {
  type: 'formatted-text',
  icon: 'file-text',
  label: 'design-studio.elements.formatted-text',
  group: 'content',
  styleCategory: 'text',
  compatiblePropertyTypes: ['formatted-text'],
  template: {
    type: 'formatted-text',
    style: { ...DefaultTextElementStyle },
    placeholder: '',
  },
  generatePlaceholder: () => generateLoremIpsum(20),
};
