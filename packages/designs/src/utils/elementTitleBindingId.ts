/**
 * Returns the property binding map key for an element's title
 * binding, which exists alongside the element's own binding.
 */
export function elementTitleBindingId(elementId: string): string {
  return `${elementId}:title`;
}
