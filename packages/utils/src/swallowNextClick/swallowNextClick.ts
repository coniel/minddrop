/**
 * Swallows the next click on the window. The swallow is dropped on
 * the next task if no click arrives.
 */
export function swallowNextClick(): void {
  // Stop the click before it reaches its target
  function swallow(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  // Swallow the next click, capturing it ahead of its target
  window.addEventListener('click', swallow, { capture: true, once: true });

  // Drop the swallow on the next task if no click arrived
  window.setTimeout(() => {
    window.removeEventListener('click', swallow, { capture: true });
  });
}
