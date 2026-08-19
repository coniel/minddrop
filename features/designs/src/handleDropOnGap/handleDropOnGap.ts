import { DropEventData } from '@minddrop/selection';
import { DesignStudioStore } from '../DesignStudioStore';
import {
  DesignElementTemplatesDataKey,
  DesignElementsDataKey,
  DesignRolesDataKey,
} from '../constants';
import { insertRoleElement } from '../insertRoleElement';
import { FlatParentDesignElement } from '../types';
import { isValidDesignStudioDrop, resolveDroppedElement } from '../utils';

/**
 * Handles a drop event on a gap in between two design elements or
 * at the edge of a container.
 *
 * @param studio - The design studio store instance.
 * @param drop - The drop event to handle.
 * @param containerId - The ID of the container element.
 * @param gapIndex - The index of the gap.
 * @param layoutId - The ID of the layout containing the container. Resolved from the container when omitted.
 */
export function handleDropOnGap(
  studio: DesignStudioStore,
  drop: DropEventData,
  containerId: string,
  gapIndex: number,
  layoutId?: string,
): void {
  // Ensure the drop event is valid
  if (!isValidDesignStudioDrop(drop)) {
    return;
  }

  const designElements = drop.data[DesignElementsDataKey];
  const templates = drop.data[DesignElementTemplatesDataKey];
  const roles = drop.data[DesignRolesDataKey];

  // If a role was dropped, insert a new element playing that role
  if (roles && roles.length) {
    insertRoleElement(studio, roles[0].roleId, containerId, gapIndex, layoutId);

    return;
  }

  // If a template was dropped, add a new element to the container
  if (templates && templates.length) {
    studio.addDesignElementFromTemplate(
      templates[0],
      containerId,
      gapIndex,
      layoutId,
    );

    return;
  }

  // An existing design element was dropped
  if (designElements && designElements.length) {
    // The dropped element, as it currently stands
    const droppedElement = resolveDroppedElement(
      studio,
      designElements[0].id,
      layoutId,
    );

    if (!droppedElement) {
      return;
    }

    // Prevent dropping a container into itself
    if (droppedElement.id === containerId) {
      return;
    }

    // Element was dropped in from a different container.
    // We can simply move it to the gap index.
    if (droppedElement.parent !== containerId) {
      // Move the dropped element to the gap index
      studio.moveDesignElement(droppedElement.id, containerId, gapIndex);

      return;
    }

    // Get the container element
    const parentElement = studio.getDesignElement<FlatParentDesignElement>(
      containerId,
      layoutId,
    );
    // Get the IDs of the elements around the gap. The gap index
    // corresponds to the index of the element after the gap.
    const nextElementId = parentElement.children[gapIndex];
    const previousElementId = parentElement.children[gapIndex - 1];

    // Prevent dropping an element onto an adjacent gap
    if (
      droppedElement.id === nextElementId ||
      droppedElement.id === previousElementId
    ) {
      return;
    }

    // Calculate the target index based on the gap index and the original
    // element index.
    const droppedElementIndex = parentElement.children.indexOf(
      droppedElement.id,
    );
    const targetIndex =
      droppedElementIndex < gapIndex ? gapIndex - 1 : gapIndex;

    // Don't sort if the element is already at the target index
    if (droppedElementIndex === targetIndex) {
      return;
    }

    // Sort the dropped element to the target index within the parent's children array.
    studio.sortDesignElement(droppedElement.id, targetIndex);
  }
}
