/**
 * Clones an element for showing as a drag preview. The clone is inert
 * and has none of the original's IDs or drag registrations.
 *
 * @param element - The element to clone.
 * @returns The clone.
 */
export function cloneForPreview(element: Element): HTMLElement {
  // Clone the element and its subtree
  const clone = element.cloneNode(true) as HTMLElement;

  // Mark the clone as a preview and take it out of the page's
  // interaction and accessibility tree.
  clone.setAttribute('data-drag-preview', '');
  clone.setAttribute('inert', '');
  clone.setAttribute('aria-hidden', 'true');

  // Strip the IDs, so that nothing resolves the clone as the original
  clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));

  // Strip the editing
  clone
    .querySelectorAll('[contenteditable]')
    .forEach((node) => node.removeAttribute('contenteditable'));

  // Strip the drag registration keys, so that no drop target or drag
  // source resolves to the clone.
  clone
    .querySelectorAll('[data-draggable-key], [data-droppable-key]')
    .forEach((node) => {
      node.removeAttribute('data-draggable-key');
      node.removeAttribute('data-droppable-key');
    });
  clone.removeAttribute('data-draggable-key');
  clone.removeAttribute('data-droppable-key');

  // Remove the canvases, as a clone does not copy their drawings
  clone.querySelectorAll('canvas').forEach((node) => node.remove());

  return clone;
}
