/**
 * Checks whether a keyboard event target is a text entry element,
 * in which case single key shortcuts must not be handled.
 *
 * @param target - The keyboard event target to check.
 * @returns Whether the target accepts text input.
 */
export function isTypingTarget(target: EventTarget | null): boolean {
  // Non-element targets never accept text input
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target.isContentEditable
  );
}
