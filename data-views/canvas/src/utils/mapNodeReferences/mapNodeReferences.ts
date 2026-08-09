import { DataViewConfig } from '@minddrop/data-views';
import { CanvasViewData } from '../../types';

/**
 * Converts the entry node IDs in a canvas view config through the
 * supplied conversion function, dropping nodes with unconvertible
 * IDs. Non-entry nodes and options pass through untouched.
 *
 * @param config - The canvas view config to convert.
 * @param convert - The value conversion function.
 * @returns A new config with converted entry node IDs.
 */
export function mapNodeReferences(
  config: DataViewConfig<object, CanvasViewData>,
  convert: (value: string) => string | null,
): DataViewConfig<object, CanvasViewData> {
  // Configs without nodes need no conversion
  if (!config.data?.nodes) {
    return config;
  }

  // Convert each entry node's ID, dropping unconvertible ones
  const nodes = config.data.nodes.flatMap((node) => {
    // Non-entry nodes carry no references
    if (node.type !== 'entry') {
      return [node];
    }

    const converted = convert(node.id);

    return converted === null ? [] : [{ ...node, id: converted }];
  });

  return { ...config, data: { ...config.data, nodes } };
}
