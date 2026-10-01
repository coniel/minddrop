/**
 * Resolves the nearest element matching a selector, starting from a
 * node and walking up through its ancestors. An element is matched
 * itself. A text node starts from its parent element.
 *
 * @param node - The node to start from.
 * @param selector - The selector to match.
 * @returns The matching element, or null when there is none.
 */
export function resolveClosestElement(
  node: Node | null,
  selector: string,
): HTMLElement | null {
  // Start from the node itself, or from a text node's parent element
  const element = node instanceof Element ? node : node?.parentElement;

  // Walk up to the nearest match
  return element?.closest<HTMLElement>(selector) ?? null;
}
