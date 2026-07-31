import { DefaultTextElementStyle, TextElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface FormattedTextElement extends DesignElementBase {
  type: 'formatted-text';

  /**
   * The element style.
   */
  style: TextElementStyle;

  /**
   * Text content displayed when the element is static.
   */
  content?: string;
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
  },
};
