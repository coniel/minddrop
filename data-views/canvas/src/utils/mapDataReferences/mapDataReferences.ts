import { DataViewConfig } from '@minddrop/data-views';
import { CanvasViewData } from '../../types';

/**
 * Converts the entry references in a canvas view config through
 * the supplied conversion function: entry node IDs, and the
 * connection endpoints attached to them. Nodes with unconvertible
 * IDs are dropped, along with connections attached to a dropped
 * or unconvertible node. Non-entry nodes and options pass through
 * untouched.
 *
 * @param config - The canvas view config to convert.
 * @param convert - The value conversion function.
 * @returns A new config with converted entry references.
 */
export function mapDataReferences(
  config: DataViewConfig<object, CanvasViewData>,
  convert: (value: string) => string | null,
): DataViewConfig<object, CanvasViewData> {
  const { data } = config;

  // Configs without data carry no references
  if (!data) {
    return config;
  }

  // Map each node's original ID to its converted ID, shared by
  // the node and connection endpoint conversions. Non-entry node
  // IDs are not references and map to themselves.
  const convertedIds = new Map<string, string | null>();

  (data.nodes ?? []).forEach((node) => {
    convertedIds.set(
      node.id,
      node.type === 'entry' ? convert(node.id) : node.id,
    );
  });

  // Convert each entry node's ID, dropping unconvertible ones
  const nodes = data.nodes?.flatMap((node) => {
    // Non-entry nodes carry no references
    if (node.type !== 'entry') {
      return [node];
    }

    const converted = convertedIds.get(node.id);

    return converted ? [{ ...node, id: converted }] : [];
  });

  // Convert each connection's endpoint node IDs, dropping
  // connections attached to a dropped or unknown node
  const connections = data.connections?.flatMap((connection) => {
    const from = convertedIds.get(connection.from.nodeId);
    const to = convertedIds.get(connection.to.nodeId);

    // An endpoint's node was dropped or is not on the canvas
    if (!from || !to) {
      return [];
    }

    return [
      {
        ...connection,
        from: { ...connection.from, nodeId: from },
        to: { ...connection.to, nodeId: to },
      },
    ];
  });

  return {
    ...config,
    data: {
      ...data,
      ...(nodes ? { nodes } : {}),
      ...(connections ? { connections } : {}),
    },
  };
}
