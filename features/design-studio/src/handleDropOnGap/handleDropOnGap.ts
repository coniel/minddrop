import { DropEventData } from '@minddrop/selection';
import {
  addDeisgnElementFromTemplate,
  getDesignElement,
  moveDesignElement,
  sortDesignElement,
} from '../DesignStudioStore';
import {
  DesignElementTemplatesDataKey,
  DesignElementsDataKey,
} from '../constants';
import { FlatParentDesignElement } from '../types';
import { isValidDesignStudioDrop } from '../utils';

/**
 * Handles a drop event on a gap in between two design elements or
 * at the edge of a container.
 *
 * @param drop - The drop event to handle.
 * @param containerId - The ID of the container element.
 * @param gapIndex - The index of the gap.
 */
export function handleDropOnGap(
  drop: DropEventData,
  containerId: string,
  gapIndex: number,
): void {
  // Ensure the drop event is valid
  if (!isValidDesignStudioDrop(drop)) {
    return;
  }

  const designElements = drop.data[DesignElementsDataKey];
  const templates = drop.data[DesignElementTemplatesDataKey];

  // If a template was dropped, add a new element to the container
  if (templates && templates.length) {
    addDeisgnElementFromTemplate(templates[0], containerId, gapIndex);

    return;
  }

  // An existing design element was dropped
  if (designElements && designElements.length) {
    // The dropped element
    const droppedElement = designElements[0];

    // Element was dropped in from a different container.
    // We can simply move it to the gap index.
    if (droppedElement.parent !== containerId) {
      // Move the dropped element to the gap index
      moveDesignElement(droppedElement.id, containerId, gapIndex);

      return;
    }

    // Get the container element
    const parentElement =
      getDesignElement<FlatParentDesignElement>(containerId);
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

    // Sort the dropped element to the target index within the parent's children array.
    sortDesignElement(droppedElement.id, targetIndex);
  }
}
