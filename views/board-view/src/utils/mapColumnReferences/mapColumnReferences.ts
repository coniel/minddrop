import { DataViewConfig } from '@minddrop/views';
import { BoardViewData } from '../../types';

/**
 * Converts the column entry values in a board view config through
 * the supplied conversion function, dropping unconvertible values.
 * Options pass through untouched.
 *
 * @param config - The board view config to convert.
 * @param convert - The value conversion function.
 * @returns A new config with converted column values.
 */
export function mapColumnReferences(
  config: DataViewConfig<object, BoardViewData>,
  convert: (value: string) => string | null,
): DataViewConfig<object, BoardViewData> {
  // Configs without columns need no conversion
  if (!config.data?.columns) {
    return config;
  }

  // Convert each column's values, dropping unconvertible ones
  const columns = config.data.columns.map((column) =>
    column.flatMap((value) => {
      const converted = convert(value);

      return converted === null ? [] : [converted];
    }),
  );

  return { ...config, data: { ...config.data, columns } };
}
