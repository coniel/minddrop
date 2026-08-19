import { DesignStudioStore } from '../../DesignStudioStore';
import { FlatRootDesignElement } from '../../types';

/**
 * Checks whether the root has page panels docked to it.
 *
 * @param studio - The design studio store instance.
 * @param root - The flat root element to check.
 * @param layoutId - The ID of the layout containing the root. Resolved from the active layout when omitted.
 * @returns Whether any of the root's children is a page panel.
 */
export function hasPagePanels(
  studio: DesignStudioStore,
  root: FlatRootDesignElement,
  layoutId?: string,
): boolean {
  // Look for a panel among the root's children
  return root.children.some(
    (childId) =>
      studio.getDesignElement(childId, layoutId)?.type === 'page-panel',
  );
}
