import { DefaultTextElementStyle, TextElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';
import { generateBadgePlaceholder } from './placeholder-generators';

export type BadgesVariant = 'rectangular' | 'round';

export type BadgesSize = 'sm' | 'md' | 'lg';

export interface BadgesElement extends DesignElementBase {
  type: 'badges';

  /**
   * The element style.
   */
  style: TextElementStyle;

  /**
   * Shape variant of the badge chips.
   * @default 'rectangular'
   */
  variant?: BadgesVariant;

  /**
   * Size of the badge chips.
   * @default 'md'
   */
  size?: BadgesSize;

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
    style: { ...DefaultTextElementStyle },
    placeholder: '',
  },
  generatePlaceholder: () => generateBadgePlaceholder(2),
};
