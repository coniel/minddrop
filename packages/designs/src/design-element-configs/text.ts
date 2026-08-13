import { TypographyStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface TextElement extends DesignElementBase {
  type: 'text';

  /**
   * The element style.
   */
  style: TypographyStyle;

  /**
   * Text content displayed when the element is static.
   */
  content?: string;
}

export const TextElementConfig: DesignElementConfig<TextElement> = {
  type: 'text',
  icon: 'align-left',
  label: 'design-studio.elements.text',
  group: 'content',
  styleCategory: 'typography',
  compatiblePropertyTypes: ['title', 'text', 'select'],
  template: {
    type: 'text',
    style: {},
  },
};
