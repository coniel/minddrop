import { DesignElement } from '../../types';

/**
 * Removes an element and everything it holds, however deeply.
 *
 * @param elements - The design's elements.
 * @param id - The ID of the element to remove.
 * @returns The remaining elements.
 */
export function removeElement(
  elements: DesignElement[],
  id: string,
): DesignElement[] {
  // The IDs of the element and everything under it
  const removed = resolveDescendantIds(elements, [id]);

  return elements.filter((element) => !removed.has(element.id));
}

/**
 * Resolves the IDs of the given elements and of everything held by
 * them, walking down a generation at a time.
 *
 * @param elements - The design's elements.
 * @param ids - The IDs to start from.
 * @returns The starting IDs and those of their descendants.
 */
function resolveDescendantIds(
  elements: DesignElement[],
  ids: string[],
): Set<string> {
  // The IDs of the generation these elements hold
  const children = elements
    .filter((element) => element.parent && ids.includes(element.parent))
    .map((element) => element.id);

  // Stop once a generation holds none
  if (children.length === 0) {
    return new Set(ids);
  }

  // Walk down to the generation below
  return new Set([...ids, ...resolveDescendantIds(elements, children)]);
}
