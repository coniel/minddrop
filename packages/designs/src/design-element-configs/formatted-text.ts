import { TypographyStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface FormattedTextElement extends DesignElementBase {
  type: 'formatted-text';

  /**
   * The element style.
   */
  style: TypographyStyle;

  /**
   * Text content displayed when the element is static.
   */
  content?: string;
}

export const FormattedTextElementConfig: DesignElementConfig<FormattedTextElement> =
  {
    type: 'formatted-text',
    icon: 'file-text',
    label: 'design-studio.elements.formatted-text',
    group: 'content',
    styleCategory: 'typography',
    compatiblePropertyTypes: ['formatted-text'],
    template: {
      type: 'formatted-text',
      style: {},
    },
  };
