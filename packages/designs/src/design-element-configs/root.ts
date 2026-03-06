import { ContainerElementStyle, DefaultContainerElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';
import type { DesignElement } from './index';

export interface RootElement extends DesignElementBase {
  type: 'root';

  /**
   * The element style.
   */
  style: ContainerElementStyle;

  /**
   * The child elements contained within this container.
   */
  children: DesignElement[];
}

export const RootElementConfig: DesignElementConfig = {
  type: 'root',
  icon: 'layout',
  label: 'design-studio.elements.root',
  styleCategory: 'container',
  compatiblePropertyTypes: ['image'],
  template: {
    type: 'root',
    style: { ...DefaultContainerElementStyle },
    children: [],
  },
};
