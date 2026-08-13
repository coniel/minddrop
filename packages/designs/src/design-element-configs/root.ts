import { ContainerStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';
import type { DesignElement } from './index';

export interface RootElement extends DesignElementBase {
  type: 'root';

  /**
   * The element style.
   */
  style: ContainerStyle;

  /**
   * The child elements contained within this container.
   */
  children: DesignElement[];
}

/**
 * The root is created with its layout rather than dragged from the
 * palette, so the config omits `group` to exclude it.
 */
export const RootElementConfig: DesignElementConfig<RootElement> = {
  type: 'root',
  icon: 'layout',
  label: 'design-studio.elements.root',
  styleCategory: 'container',
  compatiblePropertyTypes: ['image'],
  template: {
    type: 'root',
    style: {},
    children: [],
  },
};
