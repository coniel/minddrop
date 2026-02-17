import { DropEventData } from '@minddrop/selection';
import {
  addDeisgnElementFromTemplate,
  getDesignElement,
  moveDesignElement,
  sortDesignElement,
} from '../DesignStudioStore';
import { DesignElementTemplatesDataKey } from '../constants';
import { FlatChildDesignElement, FlatParentDesignElement } from '../types';
import { isValidDesignStudioDrop } from '../utils';

/**
 * Handles a drop event on a design element.
 *
 * @param drop - The drop event to handle.
 */
export function handleDropOnDesignElement(drop: DropEventData): void {
  // Ensure the drop event is valid
  if (!isValidDesignStudioDrop(drop)) {
    return;
  }

  const designElements = drop.data['design-elements'];
  const templates = drop.data[DesignElementTemplatesDataKey];

  // Get the target element
  const targetElement = getDesignElement<FlatChildDesignElement>(drop.targetId);
  // Get the target element's parent
  const parentElement = getDesignElement<FlatParentDesignElement>(
    targetElement.parent,
  );
  // Get the index of the target element within its parent
  const targetElementIndex = parentElement.children.indexOf(targetElement.id);

  let targetIndex =
    drop.position === 'after' ? targetElementIndex + 1 : targetElementIndex;

  if (templates && templates.length) {
    return addDeisgnElementFromTemplate(
      templates[0],
      parentElement.id,
      targetIndex,
    );
  }

  // An existing design element was dropped
  if (designElements && designElements.length) {
    // The dropped element
    const droppedElement = designElements[0];

    // Prevent dropping an element onto itself
    if (droppedElement.id === targetElement.id) {
      return;
    }

    // Prevent dropping a parent element onto its own children
    if (droppedElement.id === parentElement.id) {
      return;
    }

    // If the dropped element is not from the same parent, move it
    if (droppedElement.parent !== targetElement.parent) {
      return moveDesignElement(
        droppedElement.id,
        targetElement.parent,
        targetIndex,
      );
    }

    // Both elements are children of the same parent, sort the dropped element
    // to the target index within the parent's children array.
    const droppedElementIndex = parentElement.children.indexOf(
      droppedElement.id,
    );

    // Calculate the target index based on the target element index and the drop position
    targetIndex = targetElementIndex;

    if (drop.position === 'after' && droppedElementIndex > targetElementIndex) {
      targetIndex = targetElementIndex + 1;
    } else if (
      drop.position === 'before' &&
      droppedElementIndex < targetElementIndex
    ) {
      targetIndex = targetElementIndex - 1;
    }

    return sortDesignElement(droppedElement.id, targetIndex);
  }
}
