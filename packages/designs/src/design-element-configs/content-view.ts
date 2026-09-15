import { EmbedStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';

export interface ContentViewElement extends DesignElementBase {
  type: 'content-view';

  /**
   * The registered content view type the referenced content view
   * renders as.
   */
  contentViewType: string;

  /**
   * The ID of the content view the element renders.
   */
  content?: string;

  /**
   * The element style.
   */
  style: EmbedStyle;
}

// Omits a palette group: the palette lists one item per registered
// content view type rather than a single generic item, so the Views
// group is built from the content view type registry.
export const ContentViewElementConfig: DesignElementConfig<ContentViewElement> =
  {
    type: 'content-view',
    icon: 'app-window',
    label: 'design-studio.elements.view',
    styleCategory: 'embed',
    compatiblePropertyTypes: [],
    supportsStaticContent: true,
    // Content view elements reference a view of their own rather than a
    // bound value, so an empty one renders its creation form instead
    // of hiding.
    emptyBehavior: 'none',
    context: { designTypes: ['space'], layoutTypes: ['space'] },
    template: {
      type: 'content-view',
      contentViewType: 'gallery',
      // Views fill the height they are given by default, so a view
      // dropped into a space layout takes the space rather than
      // collapsing to its content.
      style: { height: 'fill' },
    },
  };
