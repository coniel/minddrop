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

// Omits a palette group: text is placed through its purpose roles
// (heading, label, text value) rather than free-form
export const TextElementConfig: DesignElementConfig<TextElement> = {
  type: 'text',
  icon: 'align-left',
  label: 'design-studio.elements.text',
  styleCategory: 'typography',
  compatiblePropertyTypes: ['title', 'text', 'select'],
  supportsStaticContent: true,
  emptyBehavior: 'hide',
  template: {
    type: 'text',
    style: {},
  },
};
