import { entityId } from '@minddrop/utils';
import { QueryNode, QueryNodeType } from '../../types';

/**
 * Creates a query graph node of the given type at the given
 * canvas position, with type specific fields at their defaults.
 *
 * @param type - The type of node to create.
 * @param position - The node's canvas position.
 *
 * @returns The new node.
 */
export function createQueryNode(
  type: QueryNodeType,
  position: { x: number; y: number },
): QueryNode {
  // Shared node fields
  const base = { id: entityId('query-node'), x: position.x, y: position.y };

  // Source nodes start without sources, showing their picker
  if (type === 'source') {
    return { ...base, type, sources: [] };
  }

  // Filter nodes start unconfigured
  if (type === 'filter') {
    return { ...base, type, property: '', propertyType: '', operator: '' };
  }

  // Collection filter nodes start without a collection, keeping
  // its members once picked
  if (type === 'collection-filter') {
    return {
      ...base,
      type,
      source: 'collection',
      collection: '',
      operator: 'is-in',
    };
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
