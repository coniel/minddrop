import { DefaultTextElementStyle, TextElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';
import { generateLoremIpsum } from './placeholder-generators';

export interface TextElement extends DesignElementBase {
  type: 'text';

  /**
   * The element style.
   */
  style: TextElementStyle;

  /**
   * Placeholder text displayed when the element has no content.
   */
  placeholder?: string;
}

export const TextElementConfig: DesignElementConfig = {
  type: 'text',
  icon: 'align-left',
  label: 'design-studio.elements.text',
  group: 'content',
  styleCategory: 'text',
  compatiblePropertyTypes: ['title', 'text', 'select', 'toggle'],
  template: {
    type: 'text',
    style: { ...DefaultTextElementStyle },
  },
  generatePlaceholder: () => generateLoremIpsum(3),
};
