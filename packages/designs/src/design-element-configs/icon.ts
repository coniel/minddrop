import { DefaultIconElementStyle, IconElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface IconElement extends DesignElementBase {
  type: 'icon';

  /**
   * The element style.
   */
  style: IconElementStyle;

  /**
   * Stringified UserIcon (e.g. "content-icon:cat:cyan" or "emoji:thumbs-up:0").
   */
  icon?: string;
}

export const IconElementConfig: DesignElementConfig = {
  type: 'icon',
  icon: 'smile',
  label: 'design-studio.elements.icon',
  group: 'media',
  styleCategory: 'icon',
  compatiblePropertyTypes: ['icon'],
  template: {
    type: 'icon',
    icon: 'content-icon:cat:default',
    style: { ...DefaultIconElementStyle },
  },
};
