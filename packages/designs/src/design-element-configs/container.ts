import { DefaultContainerStyle } from '../styles';
import { ContainerStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';
import type { DesignElement } from './DesignElement.types';

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
  supportsStaticContent: false,
  // Containers hold children rather than a value of their own,
  // so they are never hidden for being empty
  emptyBehavior: 'none',
  template: {
    type: 'container',
    style: { ...DefaultContainerStyle },
    children: [],
  },
};
