import { BadgesElementStyle, DefaultBadgesElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface BadgesElement extends DesignElementBase {
  type: 'badges';

  /**
   * Comma-separated badge labels displayed when the element
   * is static.
   */
  content?: string;

  /**
   * The element style.
   */
  style: BadgesElementStyle;
}

export const BadgesElementConfig: DesignElementConfig = {
  type: 'badges',
  icon: 'rectangle-ellipsis',
  label: 'design-studio.elements.badges',
  group: 'content',
  styleCategory: 'text',
  compatiblePropertyTypes: ['select'],
  template: {
    type: 'badges',
    style: { ...DefaultBadgesElementStyle },
  },
};
