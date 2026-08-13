import {
  ContainerElement,
  DesignElement,
  PagePanelElement,
  RootElement,
} from '../../design-element-configs';

/**
 * The region elements of a panelled page root.
 */
export interface PanelRegions {
  /**
   * The left panel, if present.
   */
  left?: PagePanelElement;

  /**
   * The content region, if the root is panelled.
   */
  content?: ContainerElement;

  /**
   * The right panel, if present.
   */
  right?: PagePanelElement;
}

/**
 * Extracts the panel regions from a page root's children.
 *
 * @param root - The page root element.
 * @returns The left panel, content region, and right panel.
 */
export function getPanelRegions(root: RootElement): PanelRegions {
  const regions: PanelRegions = {};

  for (const child of root.children) {
    if (child.type === 'page-panel' && child.side === 'left') {
      regions.left = child;
    } else if (child.type === 'page-panel' && child.side === 'right') {
      regions.right = child;
    } else if (child.type === 'container' && child.role === 'content') {
      regions.content = child;
    }
  }

  return regions;
}

/**
 * Orders panel regions into their canonical child sequence:
 * left panel, content, right panel.
 *
 * @param regions - The panel regions.
 * @returns The regions as an ordered element list, omitting absent regions.
 */
export function orderPanelRegions(regions: PanelRegions): DesignElement[] {
  const ordered: DesignElement[] = [];

  if (regions.left) {
    ordered.push(regions.left);
  }

  if (regions.content) {
    ordered.push(regions.content);
  }

  if (regions.right) {
    ordered.push(regions.right);
  }

  return ordered;
}
