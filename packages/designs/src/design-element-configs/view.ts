import { DefaultViewElementStyle, ViewElementStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

// -- Element interface --

export interface ViewElement extends DesignElementBase {
  type: 'view';

  /**
   * The registered view type to render (e.g. 'gallery', 'table').
   */
  viewType: string;

  /**
   * The element style.
   */
  style: ViewElementStyle;
}

// -- Config --

export const ViewElementConfig: DesignElementConfig = {
  type: 'view',
  icon: 'app-window',
  label: 'design-studio.elements.view',
  styleCategory: 'view',
  // TODO: remove @ts-expect-error once query property type is added
  // @ts-expect-error query property type not yet defined
  compatiblePropertyTypes: ['collection', 'query'],
  template: {
    type: 'view',
    viewType: 'gallery',
    style: { ...DefaultViewElementStyle },
  },
};
