import { isRoleElement } from '@minddrop/designs';
import { DesignStudioStore } from '../../DesignStudioStore';
import { FlatParentDesignElement } from '../../types';

/**
 * Checks whether a layout's root holds panel/content regions rather
 * than free-form content, in which case new elements can't be
 * inserted into the panel row itself.
 *
 * @param studio - The design studio store instance.
 * @param layoutId - The ID of the layout to check. Falls back to the active layout when null.
 * @returns Whether the layout's root is panelled.
 */
export function isStudioRootPanelled(
  studio: DesignStudioStore,
  layoutId: string | null,
): boolean {
  const root = studio.getDesignElement<FlatParentDesignElement>(
    'root',
    layoutId ?? undefined,
  );

  if (!root) {
    return false;
  }

  // The root is panelled when any child is a panel or the
  // structural content region
  return root.children.some((childId) => {
    const child = studio.getDesignElement(childId, layoutId ?? undefined);

    if (!child) {
      return false;
    }

    if (child.type === 'page-panel') {
      return true;
    }

    return (
      child.type === 'container' &&
      isRoleElement(child) &&
      child.role === 'page-content'
    );
  });
}
