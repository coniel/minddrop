/**
 * Resolves a block's class names from its selection and drag state.
 * Dragged blocks layer above the grid overlay while the rest sit
 * beneath it.
 *
 * @param elementId - The block's element ID.
 * @param selectedId - The selected element ID.
 * @param draggedElementId - The dragged element ID.
 * @returns The block's class name string.
 */
export function resolveElementClass(
  elementId: string,
  selectedId: string | null,
  draggedElementId: string | null,
): string {
  const classes = ['design-block-editor-element'];

  // Mark the selected block
  if (elementId === selectedId) {
    classes.push('design-block-editor-element-selected');
  }

  // Lift the dragged block above the grid overlay
  if (elementId === draggedElementId) {
    classes.push('design-block-editor-element-dragging');
  }

  return classes.join(' ');
}
