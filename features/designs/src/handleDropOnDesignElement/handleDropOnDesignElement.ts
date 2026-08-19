import { Layouts } from '@minddrop/designs';
import { DropEventData } from '@minddrop/selection';
import { DesignStudioStore } from '../DesignStudioStore';
import {
  DesignElementTemplatesDataKey,
  DesignRolesDataKey,
} from '../constants';
import { insertRoleElement } from '../insertRoleElement';
import { setElementImage } from '../setElementImage';
import { FlatChildDesignElement, FlatParentDesignElement } from '../types';
import { isValidDesignStudioDrop, resolveDroppedElement } from '../utils';

const IMAGE_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
]);

/**
 * Handles a drop event on a design element.
 *
 * @param studio - The design studio store instance.
 * @param drop - The drop event to handle.
 * @param layoutId - The ID of the layout containing the target element. Resolved from the element when omitted.
 */
export function handleDropOnDesignElement(
  studio: DesignStudioStore,
  drop: DropEventData,
  layoutId?: string,
): void {
  // Get the target element
  const targetElement = studio.getDesignElement<FlatChildDesignElement>(
    drop.targetId,
    layoutId,
  );

  if (!targetElement) {
    return;
  }

  // If native files were dropped on an image element, handle as
  // a placeholder image drop
  if (
    targetElement.type === 'image' &&
    drop.event.dataTransfer.files.length > 0
  ) {
    handleImageFileDrop(
      studio,
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
  const roles = drop.data[DesignRolesDataKey];

  // Handle drops inside an empty container-like element
  if (drop.position === 'inside' && targetElement.type === 'container') {
    if (roles && roles.length) {
      return insertRoleElement(
        studio,
        roles[0].roleId,
        targetElement.id,
        0,
        layoutId,
      );
    }

    if (templates && templates.length) {
      return studio.addDesignElementFromTemplate(
        templates[0],
        targetElement.id,
        0,
        layoutId,
      );
    }

    if (designElements && designElements.length) {
      const droppedElement = resolveDroppedElement(
        studio,
        designElements[0].id,
        layoutId,
      );

      if (!droppedElement) {
        return;
      }

      // Prevent dropping an element onto itself
      if (droppedElement.id === targetElement.id) {
        return;
      }

      return studio.moveDesignElement(droppedElement.id, targetElement.id, 0);
    }

    return;
  }

  // Get the target element's parent
  const parentElement = studio.getDesignElement<FlatParentDesignElement>(
    targetElement.parent,
    layoutId,
  );

  // Get the index of the target element within its parent
  const targetElementIndex = parentElement.children.indexOf(targetElement.id);

  let targetIndex =
    drop.position === 'after' ? targetElementIndex + 1 : targetElementIndex;

  // A role was dropped, insert a new element playing that role
  if (roles && roles.length) {
    return insertRoleElement(
      studio,
      roles[0].roleId,
      parentElement.id,
      targetIndex,
      layoutId,
    );
  }

  // An element template was dropped, add it as a new element
  if (templates && templates.length) {
    return studio.addDesignElementFromTemplate(
      templates[0],
      parentElement.id,
      targetIndex,
      layoutId,
    );
  }

  // An existing design element was dropped
  if (designElements && designElements.length) {
    const droppedElement = resolveDroppedElement(
      studio,
      designElements[0].id,
      layoutId,
    );

    if (!droppedElement) {
      return;
    }

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
      return studio.moveDesignElement(
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

    return studio.sortDesignElement(droppedElement.id, targetIndex);
  }
}

/**
 * Handles a native file drop on an image element by writing the
 * first image file into the media directory of the entity owning
 * the layout and setting it as the element's image value.
 *
 * @param studio - The design studio store instance.
 * @param elementId - The ID of the image element.
 * @param files - The dropped files.
 */
async function handleImageFileDrop(
  studio: DesignStudioStore,
  elementId: string,
  files: File[],
): Promise<void> {
  const mediaDirPath = studio.getMediaDirPath();

  if (!mediaDirPath) {
    throw new Error('Cannot add media, no media directory is set.');
  }

  // Find the first image file in the dropped files
  const imageFile = files.find((file) => IMAGE_MIME_TYPES.has(file.type));

  if (!imageFile) {
    return;
  }

  // Write the image file into the media directory
  const fileName = await Layouts.writeMediaFile(mediaDirPath, imageFile);

  await setElementImage(studio, elementId, fileName);
}
