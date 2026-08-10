/**
 * Elements that handle presses themselves, matched by the traits
 * that make them interactive rather than by component: a native
 * interactive tag, an interactive ARIA role, editable content, or
 * membership in the tab order. Components that are interactive
 * without any of those opt out with the data attribute.
 */
const INTERACTIVE_SELECTOR = [
  'a[href]',
  'audio',
  'button',
  'input',
  'label',
  'select',
  'textarea',
  'video',
  '[contenteditable="true"]',
  '[role="button"]',
  '[role="checkbox"]',
  '[role="combobox"]',
  '[role="link"]',
  '[role="listbox"]',
  '[role="menu"]',
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '[role="option"]',
  '[role="radio"]',
  '[role="slider"]',
  '[role="switch"]',
  '[role="tab"]',
  '[role="textbox"]',
  '[tabindex]:not([tabindex="-1"])',
  '[data-canvas-interactive]',
].join(', ');

/**
 * Returns whether a pressed element handles the press itself, and
 * so should not drive canvas node interactions. Checks the
 * element's ancestors too, so presses on the content of an
 * interactive element count.
 *
 * @param target - The pressed element.
 * @returns Whether the element is interactive.
 */
export function isInteractiveTarget(target: EventTarget | null): boolean {
  // Text nodes and non-element targets are never interactive
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(target.closest(INTERACTIVE_SELECTOR));
}
