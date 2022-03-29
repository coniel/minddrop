/**
 * Checks whether all items in an array are present
 * in another array. Supports items of type: string,
 * number, null, boolean, and objects containing the
 * above types.
 *
 * @param haystack The array against which to check.
 * @param needle The items to check for.
 */
export function contains(haystack: any[], needle: any[]): boolean {
  return needle.every((item) => {
    if (typeof item === 'object' && item !== null) {
      // If the item is an object, compare all of its properties
      // against the properties of objects in the haystack, including
      // the number of properties.
      const matches = haystack
        // Include only non-null objects
        .filter(
          (haystackItem) =>
            typeof haystackItem === 'object' && haystackItem !== null,
        )
        // Include only objects with the same number of properties
        .filter(
          (haystackItem) =>
            Object.keys(haystackItem).length === Object.keys(item).length,
        )
        // Compare object properties
        .filter((haystackItem) =>
          Object.keys(item).every((key) => haystackItem[key] === item[key]),
        );

      // If there was at least 1 match, the haystack contains the needle
      return matches.length !== 0;
    }

    return haystack.includes(item);
  });
}
