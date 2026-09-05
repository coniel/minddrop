/**
 * Checks whether an event target is an element text is typed into,
 * whose key presses belong to it rather than to keyboard shortcuts.
 *
 * @param target - The event target to check.
 * @returns Whether text is typed into the target.
 */
export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable
  );
}
