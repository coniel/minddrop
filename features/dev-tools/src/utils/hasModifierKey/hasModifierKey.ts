/**
 * Checks whether a keyboard event carries a modifier key which
 * makes it part of an application shortcut rather than a plain
 * dev tools key press.
 *
 * Shift is not treated as a modifier as it is required to type
 * some of the shortcut keys.
 *
 * @param event - The keyboard event to check.
 * @returns Whether the event carries a modifier key.
 */
export function hasModifierKey(event: KeyboardEvent): boolean {
  return event.metaKey || event.ctrlKey || event.altKey;
}
