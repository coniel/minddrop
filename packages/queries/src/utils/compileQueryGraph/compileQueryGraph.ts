import { Collections } from '@minddrop/collections';
import {
  EntryFilterGroup,
  EntryIdFilter,
  EntryQueryScope,
  EntrySort,
} from '@minddrop/databases';
import { getQuery } from '../../getQuery';
import {
  Query,
  QueryCollectionFilterNode,
  QueryNode,
  QuerySourceNode,
  QuerySourceReference,
} from '../../types';
import { convertQueryFilterNodeToEntryFilter } from '../convertQueryFilterNodeToEntryFilter';
import { getQueryDatabases } from '../getQueryDatabases';

export interface CompiledQueryNode {
  /**
   * The database scopes flowing into the node: the union of its
   * inputs' output scopes, with parallel branches into the same
   * database combined with OR.
   */
  inputScopes: EntryQueryScope[];

  /**
   * The database scopes flowing out of the node, after applying
   * the node's own operation.
   */
  outputScopes: EntryQueryScope[];

  /**
   * The sort criteria accumulated along the node's upstream
   * paths, primary first.
   */
  sorts: EntrySort[];

  /**
   * The smallest result limit flowing into the node, or null
   * when unlimited.
   */
  inputLimit: number | null;

  /**
   * The smallest result limit flowing out of the node, or null
   * when unlimited. Includes the node's own cap for limit
   * nodes.
   */
  limit: number | null;
}

export type CompiledQueryGraph = Record<string, CompiledQueryNode>;

/**
 * The entry IDs returned by the queries referenced by query
 * source nodes, keyed by query ID.
 */
export type QuerySourceResults = Record<string, string[]>;

/**
 * Compiles a query's node graph into per-node database scopes,
 * sort criteria and limits.
 *
 * Entries flow from source nodes through the graph: filter
 * nodes AND their comparison onto each scope, collection filter
 * nodes AND a membership test onto each scope, parallel branches
 * merging into a node are combined with OR, sort nodes append
 * their criterion in flow order, and limit nodes carry the
 * smallest cap. Incomplete nodes pass their input through
 * unchanged.
 *
 * @param query - The query whose graph to compile.
 * @param queryResults - The results of the queries referenced by query source nodes, keyed by query ID.
 *
 * @returns The compiled graph, keyed by node ID.
 */
export function compileQueryGraph(
  query: Query,
  queryResults: QuerySourceResults = {},
): CompiledQueryGraph {
  const compiled: CompiledQueryGraph = {};

  // Process nodes in dependency order so inputs compile before
  // their consumers
  const ordered = sortTopologically(query);

  ordered.forEach((node) => {
    // The compiled outputs of the node's incoming connections
    const inputs = query.connections
      .filter((connection) => connection.to === node.id)
      .map((connection) => compiled[connection.from])
      .filter(Boolean);

    // Merge the inputs' scopes, ORing parallel branches into
    // the same database
    const inputScopes = mergeScopes(inputs.map((input) => input.outputScopes));

    // Accumulate upstream sorts in flow order, primary first
    const sorts = mergeSorts(inputs.map((input) => input.sorts));

    // Carry the smallest upstream limit
    const limit = mergeLimits(inputs.map((input) => input.limit));

    compiled[node.id] = compileNode(
      node,
      inputScopes,
      sorts,
      limit,
      queryResults,
    );
  });

  return compiled;
}

/**
 * Compiles a single node's operation onto its merged inputs.
 */
function compileNode(
  node: QueryNode,
  inputScopes: EntryQueryScope[],
  sorts: EntrySort[],
  limit: number | null,
  queryResults: QuerySourceResults,
): CompiledQueryNode {
  // Source nodes emit their database's entries, or the results
  // of the query they draw from
  if (node.type === 'source') {
    return {
      inputScopes,
      outputScopes: compileSourceScopes(node, queryResults),
      sorts,
      inputLimit: limit,
      limit,
    };
  }

  // Filter nodes AND their comparison onto each input scope,
  // incomplete filters pass entries through unchanged
  if (node.type === 'filter') {
    const condition = convertQueryFilterNodeToEntryFilter(node);

    if (!condition) {
      return {
        inputScopes,
        outputScopes: inputScopes,
        sorts,
        inputLimit: limit,
        limit,
      };
    }

    // Narrow each scope by the comparison
    const outputScopes = inputScopes.map((scope) => ({
      databaseId: scope.databaseId,
      filter: {
        combinator: 'and' as const,
        filters: scope.filter ? [scope.filter, condition] : [condition],
      },
    }));

    return {
      inputScopes,
      outputScopes,
      sorts,
      inputLimit: limit,
      limit,
    };
  }

  // Collection filter nodes narrow their input to the
  // collection's members, or to everything but them
  if (node.type === 'collection-filter') {
    const memberIds = resolveCollectionFilterMembers(node);

    // A missing collection passes entries through unchanged, as
    // an unconfigured filter does
    if (!memberIds) {
      return {
        inputScopes,
        outputScopes: inputScopes,
        sorts,
        inputLimit: limit,
        limit,
      };
    }

    const condition: EntryIdFilter = {
      operator: node.operator === 'is-in' ? 'id-is-one-of' : 'id-is-not-one-of',
      entryIds: memberIds,
    };

    // Narrow each scope by the membership test
    const outputScopes = inputScopes.map((scope) => ({
      databaseId: scope.databaseId,
      filter: {
        combinator: 'and' as const,
        filters: scope.filter ? [scope.filter, condition] : [condition],
      },
    }));

    return {
      inputScopes,
      outputScopes,
      sorts,
      inputLimit: limit,
      limit,
    };
  }

  // Sort nodes append their criterion after the upstream sorts,
  // ignoring properties already sorted upstream
  if (node.type === 'sort') {
    const alreadySorted = sorts.some((sort) => sort.property === node.property);

    const outputSorts =
      node.property && node.propertyType && !alreadySorted
        ? [
            ...sorts,
            {
              property: node.property,
              propertyType: node.propertyType,
              direction: node.direction,
            },
          ]
        : sorts;

    return {
      inputScopes,
      outputScopes: inputScopes,
      sorts: outputSorts,
      inputLimit: limit,
      limit,
    };
  }

  // Limit nodes carry the smallest cap along the path
  if (node.type === 'limit') {
    const outputLimit =
      node.count > 0 ? Math.min(limit ?? Infinity, node.count) : limit;

    return {
      inputScopes,
      outputScopes: inputScopes,
      sorts,
      inputLimit: limit,
      limit: outputLimit,
    };
  }

  // Results nodes collect their input unchanged
  return {
    inputScopes,
    outputScopes: inputScopes,
    sorts,
    inputLimit: limit,
    limit,
  };
}

/**
 * Builds the scopes a source node emits, combining its sources
 * the way parallel branches merging into a node combine: scopes
 * on the same database are ORed, and an unfiltered scope
 * absorbs filtered ones.
 */
function compileSourceScopes(
  node: QuerySourceNode,
  queryResults: QuerySourceResults,
): EntryQueryScope[] {
  return mergeScopes(
    node.sources.map((source) =>
      compileSourceReferenceScopes(source, queryResults),
    ),
  );
}

/**
 * Builds the scopes a single source reference emits: a
 * database's entries unfiltered, or one scope per database a
 * referenced query draws from, each restricted to that query's
 * results.
 *
 * Restricting by result IDs rather than inlining the referenced
 * query's scopes preserves its own sorts and limit, which a
 * scope filter cannot express.
 */
function compileSourceReferenceScopes(
  source: QuerySourceReference,
  queryResults: QuerySourceResults,
): EntryQueryScope[] {
  // An unset reference emits nothing
  if (!source.id) {
    return [];
  }

  // Database sources emit all of the database's entries
  if (source.type === 'database') {
    return [{ databaseId: source.id, filter: null }];
  }

  const entryIds = queryResults[source.id];
  const referenced = getQuery(source.id, false);

  // A query which is missing, or whose results have not been
  // resolved, emits nothing
  if (!entryIds || !referenced) {
    return [];
  }

  const condition: EntryIdFilter = {
    operator: 'id-is-one-of',
    entryIds,
  };

  // Restrict each of the referenced query's databases to its
  // results
  return getQueryDatabases(referenced).map((databaseId) => ({
    databaseId,
    filter: { combinator: 'and' as const, filters: [condition] },
  }));
}

/**
 * Returns the entry IDs a collection filter node tests
 * membership against, or null when it references a collection
 * which does not exist.
 *
 * Any-collection filters span every collection, virtual ones
 * included, so entries held by another entry's collection
 * property count as members.
 */
function resolveCollectionFilterMembers(
  node: QueryCollectionFilterNode,
): string[] | null {
  // Any-collection filters pool every collection's items
  if (node.source === 'any-collection') {
    const memberIds = Collections.getAll().flatMap(
      (collection) => collection.items,
    );

    // An entry held by several collections appears once
    return Array.from(new Set(memberIds));
  }

  // An unset collection has nothing to test against
  if (!node.collection) {
    return null;
  }

  return Collections.get(node.collection, false)?.items ?? null;
}

/**
 * Orders a query's nodes so every node comes after all nodes
 * connecting into it. Nodes caught in connection cycles are
 * appended last with their cyclic inputs unresolved.
 */
function sortTopologically(query: Query): QueryNode[] {
  const ordered: QueryNode[] = [];
  const remaining = new Map(query.nodes.map((node) => [node.id, node]));

  // The number of unprocessed incoming connections per node
  const indegree = new Map<string, number>();

  query.nodes.forEach((node) => {
    indegree.set(node.id, 0);
  });

  query.connections.forEach((connection) => {
    // Ignore connections to missing nodes
    if (!remaining.has(connection.to) || !remaining.has(connection.from)) {
      return;
    }

    indegree.set(connection.to, (indegree.get(connection.to) ?? 0) + 1);
  });

  // Start from the nodes with no inputs
  const queue = query.nodes.filter((node) => indegree.get(node.id) === 0);

  while (queue.length > 0) {
    const node = queue.shift() as QueryNode;

    ordered.push(node);
    remaining.delete(node.id);

    // Release the node's downstream neighbours
    query.connections.forEach((connection) => {
      if (connection.from !== node.id) {
        return;
      }

      const downstream = indegree.get(connection.to) ?? 0;

      indegree.set(connection.to, downstream - 1);

      if (downstream - 1 === 0) {
        const downstreamNode = remaining.get(connection.to);

        if (downstreamNode) {
          queue.push(downstreamNode);
        }
      }
    });
  }

  // Append nodes caught in cycles so every node compiles
  remaining.forEach((node) => {
    ordered.push(node);
  });

  return ordered;
}

/**
 * Merges scope lists from parallel inputs, combining scopes on
 * the same database with OR. An unfiltered scope absorbs
 * filtered scopes on the same database.
 */
function mergeScopes(scopeLists: EntryQueryScope[][]): EntryQueryScope[] {
  // Collect each database's incoming filters in input order
  const filtersByDatabase = new Map<string, EntryFilterGroup[] | null>();

  scopeLists.forEach((scopes) => {
    scopes.forEach((scope) => {
      const existing = filtersByDatabase.get(scope.databaseId);

      // An unfiltered branch already matches all of the
      // database's entries
      if (existing === null) {
        return;
      }

      // An unfiltered scope absorbs the database's filters
      if (!scope.filter) {
        filtersByDatabase.set(scope.databaseId, null);

        return;
      }

      filtersByDatabase.set(scope.databaseId, [
        ...(existing ?? []),
        scope.filter,
      ]);
    });
  });

  // Build the merged scope list, ORing parallel filters
  const merged: EntryQueryScope[] = [];

  filtersByDatabase.forEach((filters, databaseId) => {
    if (filters === null) {
      merged.push({ databaseId, filter: null });

      return;
    }

    if (filters.length === 1) {
      merged.push({ databaseId, filter: filters[0] });

      return;
    }

    merged.push({ databaseId, filter: { combinator: 'or', filters } });
  });

  return merged;
}

/**
 * Merges sort lists from parallel inputs in input order,
 * keeping the first criterion per property.
 */
function mergeSorts(sortLists: EntrySort[][]): EntrySort[] {
  const merged: EntrySort[] = [];

  sortLists.forEach((sorts) => {
    sorts.forEach((sort) => {
      // Keep the first criterion per property
      if (!merged.some((existing) => existing.property === sort.property)) {
        merged.push(sort);
      }
    });
  });

  return merged;
}

/**
 * Merges limits from parallel inputs, keeping the smallest.
 */
function mergeLimits(limits: (number | null)[]): number | null {
  // Ignore unlimited branches
  const capped = limits.filter(
    (limit): limit is number => typeof limit === 'number',
  );

  if (capped.length === 0) {
    return null;
  }

  return Math.min(...capped);
}
