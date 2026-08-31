/**
 * Returns the base name suffixed with the lowest number making it
 * unique among the taken names (case-insensitive), the bare base
 * name when it is free.
 *
 * @param baseName - The preferred name.
 * @param takenNames - The names already in use.
 * @returns The unique name.
 */
export function resolveUniqueTagName(
  baseName: string,
  takenNames: string[],
): string {
  const taken = new Set(takenNames.map((name) => name.toLowerCase()));

  // The base name is free
  if (!taken.has(baseName.toLowerCase())) {
    return baseName;
  }

  // Suffix with the lowest free number
  let number = 2;

  while (taken.has(`${baseName.toLowerCase()} ${number}`)) {
    number += 1;
  }

  return `${baseName} ${number}`;
}
