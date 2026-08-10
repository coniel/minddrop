import { entityId } from '@minddrop/utils';
import { QueryNode, QueryNodeType } from '../../types';

export interface CreateQueryNodeOptions {
  /**
   * The source database ID, applied to source nodes.
   */
  database?: string;
}

/**
 * Creates a query graph node of the given type at the given
 * canvas position, with type specific fields at their defaults.
 *
 * @param type - The type of node to create.
 * @param position - The node's canvas position.
 * @param options - Type specific node options.
 *
 * @returns The new node.
 */
export function createQueryNode(
  type: QueryNodeType,
  position: { x: number; y: number },
  options: CreateQueryNodeOptions = {},
): QueryNode {
  // Shared node fields
  const base = { id: entityId('query-node'), x: position.x, y: position.y };

  // Source nodes emit the configured database's entries
  if (type === 'source') {
    return { ...base, type, database: options.database || '' };
  }

  // Filter nodes start unconfigured
  if (type === 'filter') {
    return { ...base, type, property: '', propertyType: '', operator: '' };
  }

  // Sort nodes start unconfigured, sorting ascending
  if (type === 'sort') {
    return {
      ...base,
      type,
      property: '',
      propertyType: '',
      direction: 'ascending',
    };
  }

  // Limit nodes start with no cap
  if (type === 'limit') {
    return { ...base, type, count: 0 };
  }

  return { ...base, type: 'results' };
}
