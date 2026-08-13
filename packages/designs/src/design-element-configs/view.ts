import { EmbedStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface ViewElement extends DesignElementBase {
  type: 'view';

  /**
   * The registered view type to render (e.g. 'gallery', 'table').
   */
  viewType: string;

  /**
   * The ID of the referenced data view when the element is static.
   */
  content?: string;

  /**
   * The element style.
   */
  style: EmbedStyle;
}

export const ViewElementConfig: DesignElementConfig<ViewElement> = {
  type: 'view',
  icon: 'app-window',
  label: 'design-studio.elements.view',
  styleCategory: 'embed',
  compatiblePropertyTypes: ['collection'],
  context: { layoutTypes: ['page', 'space'] },
  template: {
    type: 'view',
    viewType: 'gallery',
    style: { height: 'fill' },
  },
};
