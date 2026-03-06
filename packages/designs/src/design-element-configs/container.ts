import { ContainerElementStyle, DefaultContainerElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';
import type { DesignElement } from './index';

export interface ContainerElement extends DesignElementBase {
  type: 'container';

  /**
   * The element style.
   */
  style: ContainerElementStyle;

  /**
   * The child elements contained within this container.
   */
  children: DesignElement[];
}

export const ContainerElementConfig: DesignElementConfig = {
  type: 'container',
  icon: 'box',
  label: 'design-studio.elements.container',
  group: 'layout',
  styleCategory: 'container',
  compatiblePropertyTypes: ['image'],
  template: {
    type: 'container',
    style: { ...DefaultContainerElementStyle, backgroundColor: 'transparent' },
    children: [],
  },
};
