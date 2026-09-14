/**
 * Resolves a slot block's class names from its selection state.
 *
 * @param slotId - The slot child's element ID.
 * @param selectedId - The selected element ID.
 * @returns The slot block's class name string.
 */
export function resolveSlotClass(
  slotId: string,
  selectedId: string | null,
): string {
  const classes = ['design-block-editor-slot'];

  // Mark the selected slot block
  if (slotId === selectedId) {
    classes.push('design-block-editor-slot-selected');
  }

  return classes.join(' ');
}
