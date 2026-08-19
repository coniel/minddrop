import { TypographyStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface FormattedTextElement extends DesignElementBase {
  type: 'formatted-text';

  /**
   * The element style.
   */
  style: TypographyStyle;
}

/**
 * Formatted text is only inserted through the content display
 * role, so the config omits `group` to exclude it from the
 * palette.
 */
export const FormattedTextElementConfig: DesignElementConfig<FormattedTextElement> =
  {
    type: 'formatted-text',
    icon: 'file-text',
    label: 'design-studio.elements.formatted-text',
    styleCategory: 'typography',
    compatiblePropertyTypes: ['formatted-text'],
    supportsStaticContent: false,
    emptyBehavior: 'hide',
    template: {
      type: 'formatted-text',
      style: {},
    },
  };
