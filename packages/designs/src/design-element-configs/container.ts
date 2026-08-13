import { ContainerStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';
import type { DesignElement } from './index';

export interface ContainerElement extends DesignElementBase {
  type: 'container';

  /**
   * The element style.
   */
  style: ContainerStyle;

  /**
   * The child elements contained within this container.
   */
  children: DesignElement[];
}

export const ContainerElementConfig: DesignElementConfig<ContainerElement> = {
  type: 'container',
  icon: 'box',
  label: 'design-studio.elements.container',
  group: 'layout',
  styleCategory: 'container',
  compatiblePropertyTypes: ['image'],
  template: {
    type: 'container',
    style: {},
    children: [],
  },
};
