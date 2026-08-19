import { DefaultContainerStyle } from '../styles';
import { RootStyle } from '../styles';
import { DesignElementBase, DesignElementConfig, LayoutType } from '../types';
import type { DesignElement } from './DesignElement.types';

export interface RootElement extends DesignElementBase {
  type: 'root';

  /**
   * The type of the layout the root belongs to, deciding the
   * default treatment of an unset background.
   */
  layoutType?: LayoutType;

  /**
   * The element style.
   */
  style: RootStyle;

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
  supportsStaticContent: false,
  // The layout root holds children rather than a value of its
  // own, so it is never hidden for being empty
  emptyBehavior: 'none',
  template: {
    type: 'root',
    style: { ...DefaultContainerStyle },
    children: [],
  },
};
