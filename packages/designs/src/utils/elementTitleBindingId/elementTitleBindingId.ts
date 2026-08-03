/**
 * Returns the property binding key for an element's title binding.
 * Title bindings share the element binding map with content
 * bindings, keyed by element ID with a ':title' suffix.
 *
 * @param elementId - The ID of the element.
 * @returns The title binding key.
 */
export function elementTitleBindingId(elementId: string): string {
  return `${elementId}:title`;
}
