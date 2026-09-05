import { DatabaseEntry } from '@minddrop/databases';
import { i18n } from '@minddrop/i18n';
import { SelectPropertySchema } from '@minddrop/properties';
import { NO_VALUE_COLUMN } from '../../constants';
import { KanbanColumn, KanbanOrder } from '../../types';
import { resolveEntryColumnValue } from '../resolveEntryColumnValue';

/**
 * Generates the board's columns from a select property: one
 * column per declared option, preceded by the column holding
 * entries without a value, which is left out when empty. Each
 * column's entries are ordered by the saved order, with entries
 * it does not place prepended in the order they were given.
 *
 * @param entries - The entries to arrange into columns.
 * @param property - The select property the columns are generated from.
 * @param order - The saved placement of entries within their columns.
 * @returns The board's columns.
 */
export function resolveKanbanColumns(
  entries: DatabaseEntry[],
  property: SelectPropertySchema,
  order: KanbanOrder,
): KanbanColumn[] {
  // Bucket the entries by the column their property value places
  // them in.
  const buckets = new Map<string, string[]>();

  entries.forEach((entry) => {
    // The column the entry's property value places it in
    const value = resolveEntryColumnValue(entry, property);
    const bucket = buckets.get(value);

    // Check if the entry is the first to land in the column. If
    // so, start the bucket off with it.
    if (!bucket) {
      buckets.set(value, [entry.id]);

      return;
    }

    // Add the entry to the bucket the earlier entries built up
    bucket.push(entry.id);
  });

  // The no-value column comes first, followed by a column per
  // declared option in schema order.
  const columns: Omit<KanbanColumn, 'entryIds'>[] = [
    {
      value: NO_VALUE_COLUMN,
      label: i18n.t('dataViews.kanban.noValue'),
    },
    ...property.options.map((option) => ({
      value: option.value,
      label: option.value,
      color: option.color,
    })),
  ];

  // Fill each column with its bucket, ordered by the saved order
  const filled = columns.map((column) => ({
    ...column,
    entryIds: orderColumnEntries(
      buckets.get(column.value) ?? [],
      order[column.value] ?? [],
    ),
  }));

  // Drop the no-value column when empty
  return filled.filter(
    (column) => column.value !== NO_VALUE_COLUMN || column.entryIds.length > 0,
  );
}

/**
 * Orders a column's entries by the saved order, dropping saved
 * entries which are no longer in the column and prepending
 * entries the saved order does not place, as those are likely to
 * be newly added.
 *
 * @param entryIds - The IDs of the entries currently in the column.
 * @param savedOrder - The saved order of the column's entries.
 * @returns The ordered entry IDs.
 */
function orderColumnEntries(
  entryIds: string[],
  savedOrder: string[],
): string[] {
  const inColumn = new Set(entryIds);

  // Filter the saved order down to entries still in the column
  const placed = savedOrder.filter((entryId) => inColumn.has(entryId));
  const placedIds = new Set(placed);

  // Filter for entries the saved order does not place
  const unplaced = entryIds.filter((entryId) => !placedIds.has(entryId));

  return [...unplaced, ...placed];
}
