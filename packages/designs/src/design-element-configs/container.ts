import { ContainerElementStyle, DefaultContainerElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';
import type { DesignElement } from './index';

export interface ContainerElement extends DesignElementBase {
  type: 'container';

  /**
   * Marks the container as the content region of a panelled page
   * root. The content region cannot be moved or deleted and fills
   * the space left by the panels.
   */
  role?: 'content';

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
