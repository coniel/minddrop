import { PagePanelSide, RootElement } from '../../design-element-configs';
import { getPanelRegions, orderPanelRegions } from '../getPanelRegions';

/**
 * Disables the panel on the given side of a page root, discarding
 * its contents. Removing the last panel unwraps the content region
 * back into the root, restoring it to a plain droppable container.
 * Returns the root unchanged when the side has no panel.
 *
 * @param root - The page root element.
 * @param side - The side whose panel to remove.
 * @returns The updated root.
 */
export function disablePagePanel(
  root: RootElement,
  side: PagePanelSide,
): RootElement {
  const regions = getPanelRegions(root);
  const panel = side === 'left' ? regions.left : regions.right;

  // No panel on this side
  if (!panel) {
    return root;
  }

  const otherPanel = side === 'left' ? regions.right : regions.left;

  // Removing the last panel: unwrap the content region back into the
  // root. The root kept its styling while panelled, so only restore
  // the column direction and the padding that was moved to the content
  // region.
  if (!otherPanel) {
    const content = regions.content;

    return {
      ...root,
      style: {
        ...root.style,
        direction: 'column',
        paddingTop: content?.style.paddingTop ?? 0,
        paddingRight: content?.style.paddingRight ?? 0,
        paddingBottom: content?.style.paddingBottom ?? 0,
        paddingLeft: content?.style.paddingLeft ?? 0,
      },
      children: content ? content.children : [],
    };
  }

  // Another panel remains: drop this panel, keep the panel row.
  return {
    ...root,
    children: orderPanelRegions({
      left: side === 'left' ? undefined : regions.left,
      content: regions.content,
      right: side === 'right' ? undefined : regions.right,
    }),
  };
}
