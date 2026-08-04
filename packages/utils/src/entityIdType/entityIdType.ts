/**
 * Extracts the entity type name from a typed entity ID.
 *
 * @param id - The entity ID.
 * @returns The type name, or null if the ID has no type prefix.
 */
export function entityIdType(id: string): string | null {
  const separatorIndex = id.indexOf('_');

  return separatorIndex > 0 ? id.slice(0, separatorIndex) : null;
}
