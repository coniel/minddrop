import { ContainerStyle } from '../styles';
import { DesignElementBase, DesignElementConfig } from '../types';
import type { DesignElement } from './DesignElement.types';

/**
 * The side of the page a panel is docked to.
 */
export type PagePanelSide = 'left' | 'right';

/**
 * Default width of a newly created page panel, in pixels.
 */
export const DefaultPagePanelWidth = 240;

export interface PagePanelElement extends DesignElementBase {
  type: 'page-panel';

  /**
   * The side of the page this panel is docked to.
   */
  side: PagePanelSide;

  /**
   * Whether the panel starts open when the page is displayed.
   * Omitted panels start open.
   */
  defaultOpen?: boolean;

  /**
   * The panel width in pixels. Runtime geometry resized by the
   * user, not style vocabulary.
   */
  width: number;

  /**
   * The element style.
   */
  style: ContainerStyle;

  /**
   * The child elements contained within this panel.
   */
  children: DesignElement[];
}

/**
 * Panels are created via the page root's panel toggles rather than
 * dragged from the palette, so the config omits `group` to exclude
 * it from the palette.
 */
export const PagePanelElementConfig: DesignElementConfig<PagePanelElement> = {
  type: 'page-panel',
  icon: 'panel-left',
  label: 'design-studio.elements.page-panel',
  styleCategory: 'container',
  compatiblePropertyTypes: ['image'],
  supportsStaticContent: false,
  // Panels hold children rather than a value of their own, so
  // they are never hidden for being empty
  emptyBehavior: 'none',
  context: { layoutTypes: ['page', 'space'] },
  template: {
    type: 'page-panel',
    side: 'left',
    width: DefaultPagePanelWidth,
    style: {},
    children: [],
  },
};
