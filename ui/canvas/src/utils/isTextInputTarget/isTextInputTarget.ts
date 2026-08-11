/**
 * Checks whether an event target is an element text is typed
 * into, which keyboard shortcuts leave alone.
 *
 * @param target - The event target to check.
 * @returns Whether text is typed into the target.
 */
export function isTextInputTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;

  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
}
