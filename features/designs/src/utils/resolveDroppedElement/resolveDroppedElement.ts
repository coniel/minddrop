import { DesignStudioStore } from '../../DesignStudioStore';
import { FlatChildDesignElement } from '../../types';

/**
 * Resolves a dragged design element from the store by its ID.
 *
 * Drag payloads are serialized from the selection, which keeps the
 * element data captured when the element was first selected. An
 * element dragged twice therefore arrives carrying the parent and
 * children it had before the first drop, so only its ID can be
 * trusted.
 *
 * @param studio - The design studio store instance.
 * @param elementId - The ID of the dragged element.
 * @param layoutId - The ID of the layout containing the element. Resolved from the element when omitted.
 * @returns The element as it currently stands, or null when it no longer exists.
 */
export function resolveDroppedElement(
  studio: DesignStudioStore,
  elementId: string,
  layoutId?: string,
): FlatChildDesignElement | null {
  const element = studio.getDesignElement<FlatChildDesignElement>(
    elementId,
    layoutId,
  );

  // The element may have been deleted mid-drag, and layout roots
  // cannot be dragged anywhere
  if (!element || !('parent' in element)) {
    return null;
  }

  return element;
}
