// The character separating a wikilink's reference from its fragment
const FragmentSeparator = '#';

/**
 * Resolves a wikilink's target as it is written between the
 * brackets: the reference, followed by the fragment when there is
 * one.
 *
 * @param reference - What the link points at.
 * @param fragment - The part of the target the link points into.
 * @returns The target spelling.
 */
export function resolveWikilinkTarget(
  reference: string,
  fragment?: string,
): string {
  // Return the reference alone when there is no fragment
  if (!fragment) {
    return reference;
  }

  // Join the reference and the fragment
  return `${reference}${FragmentSeparator}${fragment}`;
}
