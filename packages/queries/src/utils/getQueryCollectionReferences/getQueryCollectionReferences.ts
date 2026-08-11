import { Query } from '../../types';

export interface QueryCollectionReferences {
  /**
   * The IDs of the collections the query's collection filters
   * test membership against.
   */
  collectionIds: string[];

  /**
   * Whether the query has a filter spanning every collection,
   * making any collection change affect its results.
   */
  anyCollection: boolean;
}

/**
 * Returns the collections referenced by a query's collection
 * filter nodes, ignoring nodes without a collection.
 *
 * @param query - The query whose collection references to get.
 *
 * @returns The referenced collections.
 */
export function getQueryCollectionReferences(
  query: Query,
): QueryCollectionReferences {
  const collectionIds = query.nodes.flatMap((node) =>
    node.type === 'collection-filter' &&
    node.source === 'collection' &&
    node.collection
      ? [node.collection]
      : [],
  );

  const anyCollection = query.nodes.some(
    (node) =>
      node.type === 'collection-filter' && node.source === 'any-collection',
  );

  return {
    // Multiple nodes may reference the same collection
    collectionIds: Array.from(new Set(collectionIds)),
    anyCollection,
  };
}
