import { DataViewConfig } from '@minddrop/data-views';
import { KanbanOrder, KanbanViewData } from '../../types';

/**
 * Converts the entry values in a kanban view config's order
 * through the supplied conversion function, dropping
 * unconvertible values. The column keys are option values rather
 * than item references, so they pass through untouched, as do the
 * options.
 *
 * @param config - The kanban view config to convert.
 * @param convert - The value conversion function.
 * @returns A new config with converted order values.
 */
export function mapOrderReferences(
  config: DataViewConfig<object, KanbanViewData>,
  convert: (value: string) => string | null,
): DataViewConfig<object, KanbanViewData> {
  // Check if the config has an order. Configs without one need no
  // conversion.
  if (!config.data?.order) {
    return config;
  }

  // Convert each column's values, dropping unconvertible ones
  const order: KanbanOrder = {};

  Object.entries(config.data.order).forEach(([columnValue, entryIds]) => {
    order[columnValue] = entryIds.flatMap((entryId) => {
      const converted = convert(entryId);

      return converted === null ? [] : [converted];
    });
  });

  return { ...config, data: { ...config.data, order } };
}
