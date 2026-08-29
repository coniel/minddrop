import { EmbedStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface DataViewElement extends DesignElementBase {
  type: 'data-view';

  /**
   * The registered data view type the referenced data view
   * renders as.
   */
  dataViewType: string;

  /**
   * The ID of the data view the element renders.
   */
  content?: string;

  /**
   * The element style.
   */
  style: EmbedStyle;
}

// Omits a palette group: the palette lists one item per registered
// data view type rather than a single generic item, so the Views
// group is built from the data view type registry
export const DataViewElementConfig: DesignElementConfig<DataViewElement> = {
  type: 'data-view',
  icon: 'app-window',
  label: 'design-studio.elements.view',
  styleCategory: 'embed',
  compatiblePropertyTypes: [],
  supportsStaticContent: true,
  // Data view elements reference a view of their own rather than a
  // bound value, so an empty one renders its creation form instead
  // of hiding
  emptyBehavior: 'none',
  context: { designTypes: ['space'], layoutTypes: ['space'] },
  template: {
    type: 'data-view',
    dataViewType: 'gallery',
    // Views fill the height they are given by default, so a view
    // dropped into a space layout takes the space rather than
    // collapsing to its content
    style: { height: 'fill' },
  },
};
