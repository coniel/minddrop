interface Item {
  /**
   * The item's ID which will be used as the key
   * in the map.
   */
  id: string;
}

/**
 * Returns a `{ [id]: Item }` map of the passed in items.
 *
 * @param items The items to map.
 * @returns A map of items.
 */
export function mapById(items: Item[]): Record<string, Item> {
  return items.reduce((map, item) => ({ ...map, [item.id]: item }), {});
}
