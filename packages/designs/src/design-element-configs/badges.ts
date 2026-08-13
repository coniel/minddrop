import { BadgeStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface BadgesElement extends DesignElementBase {
  type: 'badges';

  /**
   * The element style.
   */
  style: BadgeStyle;

  /**
   * Comma-separated badge labels displayed when the element
   * is static.
   */
  content?: string;
}

export const BadgesElementConfig: DesignElementConfig<BadgesElement> = {
  type: 'badges',
  icon: 'rectangle-ellipsis',
  label: 'design-studio.elements.badges',
  group: 'content',
  styleCategory: 'badge',
  compatiblePropertyTypes: ['select'],
  template: {
    type: 'badges',
    style: {
      background: 'accent',
      borderRadius: 'sm',
      padding: '0-5',
      fontSize: 'xs',
    },
  },
};
