import { DefaultTextElementStyle, TextElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface TextElement extends DesignElementBase {
  type: 'text';

  /**
   * The element style.
   */
  style: TextElementStyle;

  /**
   * Text content displayed when the element is static.
   */
  content?: string;
}

export const TextElementConfig: DesignElementConfig = {
  type: 'text',
  icon: 'align-left',
  label: 'design-studio.elements.text',
  group: 'content',
  styleCategory: 'text',
  compatiblePropertyTypes: ['title', 'text', 'select'],
  template: {
    type: 'text',
    style: { ...DefaultTextElementStyle },
  },
};
