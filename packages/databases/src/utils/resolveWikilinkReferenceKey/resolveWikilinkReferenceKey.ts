/**
 * Resolves the key a wikilink reference is indexed and matched by. The key
 * ignores case, so `Book` and `book` have the same key and match the same
 * entry.
 *
 * @param reference - The reference, as written.
 * @returns The reference's key.
 */
export function resolveWikilinkReferenceKey(reference: string): string {
  return reference.toLowerCase();
}
