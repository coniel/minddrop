import { uuid } from '@minddrop/utils';
import {
  ContainerElement,
  DefaultPagePanelWidth,
  PagePanelElement,
  PagePanelSide,
  RootElement,
} from '../../design-element-configs';
import {
  ContainerElementStyle,
  DefaultContainerElementStyle,
} from '../../styles';
import { getPanelRegions, orderPanelRegions } from '../getPanelRegions';
import { isPanelledRoot } from '../isPanelledRoot';

/**
 * Enables a panel on the given side of a page root. Enabling the
 * first panel wraps the root's existing children into a content
 * region and switches the root to a panel row. Returns the root
 * unchanged when the side already has a panel.
 *
 * @param root - The page root element.
 * @param side - The side to add the panel to.
 * @returns The updated root.
 */
export function enablePagePanel(
  root: RootElement,
  side: PagePanelSide,
): RootElement {
  const regions = getPanelRegions(root);

  // The side already has a panel
  if (
    (side === 'left' && regions.left) ||
    (side === 'right' && regions.right)
  ) {
    return root;
  }

  const panelled = isPanelledRoot(root);

  // When enabling the first panel, move the root's free-form children
  // into a content region and clean up the root's own style.
  let content = regions.content;
  let style = root.style;

  if (!panelled) {
    content = {
      id: uuid(),
      type: 'container',
      role: 'content',
      style: root.style,
      children: root.children,
    };
    style = createPanelledRootStyle(root.style);
  }

  const panel = createPagePanel(side);

  const nextRegions = {
    left: side === 'left' ? panel : regions.left,
    content: content ?? createContentRegion(),
    right: side === 'right' ? panel : regions.right,
  };

  return {
    ...root,
    style,
    children: orderPanelRegions(nextRegions),
  };
}

/**
 * Builds a new empty panel docked to the given side.
 */
function createPagePanel(side: PagePanelSide): PagePanelElement {
  return {
    id: uuid(),
    type: 'page-panel',
    side,
    style: {
      ...DefaultContainerElementStyle,
      backgroundColor: 'transparent',
      width: DefaultPagePanelWidth,
      widthUnit: 'px',
    },
    children: [],
  };
}

/**
 * Builds an empty content region. Used as a fallback when a root is
 * panelled but somehow lacks a content region.
 */
function createContentRegion(): ContainerElement {
  return {
    id: uuid(),
    type: 'container',
    role: 'content',
    style: { ...DefaultContainerElementStyle },
    children: [],
  };
}

/**
 * Derives the panel-row style for a root from its previous style:
 * a horizontal, transparent, gutter-free row that lets its regions
 * fill the frame.
 */
function createPanelledRootStyle(
  style: ContainerElementStyle,
): ContainerElementStyle {
  return {
    ...style,
    direction: 'row',
    gap: 0,
    stretch: true,
    backgroundColor: 'transparent',
    backgroundImage: '',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    borderStyle: 'none',
    borderRadiusTopLeft: 0,
    borderRadiusTopRight: 0,
    borderRadiusBottomRight: 0,
    borderRadiusBottomLeft: 0,
  };
}
