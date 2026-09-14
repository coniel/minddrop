import { FilterAdaptersRegistry } from '../../FilterAdaptersRegistry';
import { FilterableItem } from '../../types';

/**
 * Lists the items of every filterable entity type, by label.
 *
 * @returns The items, sorted by label.
 */
export function listFilterableItems(): FilterableItem[] {
  // Collect every adapter's items with their labels and icons
  const items = FilterAdaptersRegistry.getAll().flatMap((adapter) =>
    adapter.getAll().map(
      (item): FilterableItem => ({
        id: item.id,
        label: adapter.label(item),
        icon: adapter.icon?.(item),
      }),
    ),
  );

  // Sort the items by label
  return items.sort((itemA, itemB) => itemA.label.localeCompare(itemB.label));
}
