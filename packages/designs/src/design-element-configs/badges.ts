import { BadgesElementStyle, DefaultBadgesElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';
import { generateBadgePlaceholder } from './placeholder-generators';

export interface BadgesElement extends DesignElementBase {
  type: 'badges';

  /**
   * The element style.
   */
  style: BadgesElementStyle;

  /**
   * Comma-separated placeholder badge labels displayed
   * when the element has no mapped property.
   */
  placeholder?: string;
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
    placeholder: '',
  },
  generatePlaceholder: () => generateBadgePlaceholder(2),
};
