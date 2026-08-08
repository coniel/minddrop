/**
 * Sets a drag event's preview image to a clone of the given element.
 * Used where the browser-generated preview fails or shows the wrong
 * element, e.g. drags started from invisible drag handles or from
 * elements inside transformed ancestors.
 *
 * Call from a drag start event handler.
 *
 * @param event - The drag start event.
 * @param element - The element to use as the drag preview.
 */
export function setDragPreview(
  event: React.DragEvent | DragEvent,
  element: Element,
): void {
  // Nothing to do if the event has no data transfer object
  if (!event.dataTransfer) {
    return;
  }

  const rect = element.getBoundingClientRect();

  // Clone the element, sized explicitly since the clone is detached
  // from the element's layout context
  const clone = element.cloneNode(true) as Element;

  clone.setAttribute(
    'style',
    `width: ${rect.width}px !important; height: ${rect.height}px !important; position: fixed; top: -9999px; left: -9999px;`,
  );

  // The clone must be rendered in the document for the browser to
  // capture it as a drag image
  document.body.appendChild(clone);

  // Keep the cursor at the same position within the preview as it
  // is within the element
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;

  event.dataTransfer.setDragImage(clone, offsetX, offsetY);

  // Remove the clone once the browser has captured it
  requestAnimationFrame(() => {
    clone.remove();
  });
}
