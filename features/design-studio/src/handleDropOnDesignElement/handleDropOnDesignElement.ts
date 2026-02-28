import { Designs } from '@minddrop/designs';
import { DropEventData } from '@minddrop/selection';
import {
  addDeisgnElementFromTemplate,
  getDesignElement,
  moveDesignElement,
  sortDesignElement,
  updateDesignElement,
} from '../DesignStudioStore';
import { DesignElementTemplatesDataKey } from '../constants';
import { FlatChildDesignElement, FlatParentDesignElement } from '../types';
import { isValidDesignStudioDrop } from '../utils';

const IMAGE_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
]);

/**
 * Handles a native file drop on an image element by writing
 * the first image file as a placeholder media and setting it
 * on the element.
 *
 * @param elementId - The ID of the image element.
 * @param files - The dropped files.
 */
async function handleImageFileDrop(
  elementId: string,
  files: File[],
): Promise<void> {
  // Find the first image file in the dropped files
  const imageFile = files.find((file) => IMAGE_MIME_TYPES.has(file.type));

  if (!imageFile) {
    return;
  }

  // Write the image file to the placeholder-media directory
  const fileName = await Designs.writePlaceholderMedia(imageFile);

  // Set the placeholder image on the element
  updateDesignElement(elementId, { placeholderImage: fileName });
}

/**
 * Handles a drop event on a design element.
 *
 * @param drop - The drop event to handle.
 */
export function handleDropOnDesignElement(drop: DropEventData): void {
  // Get the target element
  const targetElement = getDesignElement<FlatChildDesignElement>(drop.targetId);

  // If native files were dropped on an image element, handle as
  // a placeholder image drop
  if (
    targetElement.type === 'image' &&
    drop.event.dataTransfer.files.length > 0
  ) {
    handleImageFileDrop(
      targetElement.id,
      Array.from(drop.event.dataTransfer.files),
    );

    return;
  }

  // Ensure the drop event is valid for internal drag-and-drop
  if (!isValidDesignStudioDrop(drop)) {
    return;
  }

  const designElements = drop.data['design-elements'];
  const templates = drop.data[DesignElementTemplatesDataKey];

  // Get the target element's parent
  const parentElement = getDesignElement<FlatParentDesignElement>(
    targetElement.parent,
  );

  // Get the index of the target element within its parent
  const targetElementIndex = parentElement.children.indexOf(targetElement.id);

  let targetIndex =
    drop.position === 'after' ? targetElementIndex + 1 : targetElementIndex;

  // An element template was dropped, add it as a new element
  if (templates && templates.length) {
    return addDeisgnElementFromTemplate(
      templates[0],
      parentElement.id,
      targetIndex,
    );
  }

  // An existing design element was dropped
  if (designElements && designElements.length) {
    const droppedElement = designElements[0];

    // Prevent dropping an element onto itself
    if (droppedElement.id === targetElement.id) {
      return;
    }

    // Prevent dropping a parent element onto its own children
    if (droppedElement.id === parentElement.id) {
      return;
    }

    // If the dropped element is from a different parent, move it
    if (droppedElement.parent !== targetElement.parent) {
      return moveDesignElement(
        droppedElement.id,
        targetElement.parent,
        targetIndex,
      );
    }

    // Both elements share the same parent, sort the dropped element
    // to the target index within the parent's children array
    const droppedElementIndex = parentElement.children.indexOf(
      droppedElement.id,
    );

    // Adjust the target index based on the relative positions
    // of the dragged and target elements
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
