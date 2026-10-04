import { Collections } from '@minddrop/collections';
import {
  EntryFilter,
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
} from '../../types';
import { convertQueryFilterNodeToEntryFilter } from '../convertQueryFilterNodeToEntryFilter';
import { getQueryDatabase } from '../getQueryDatabase';

export interface CompiledQueryNode {
  /**
   * The database scope flowing into the node: its inputs' output
   * scopes merged, with parallel branches combined with OR. Null
   * when no source flows into the node.
   */
  inputScope: EntryQueryScope | null;

  /**
   * The database scope flowing out of the node, after applying
   * the node's own operation. Null when no source flows out of
   * the node.
   */
  outputScope: EntryQueryScope | null;

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
 * Compiles a query's node graph into per-node database scopes,
 * sort criteria and limits.
 *
 * Entries flow from the source node through the graph: filter
 * nodes AND their comparison onto the scope, collection filter
 * nodes AND a membership test onto the scope, parallel branches
 * merging into a node are combined with OR, sort nodes append
 * their criterion in flow order, and limit nodes carry the
 * smallest cap. Incomplete nodes pass their input through
 * unchanged.
 *
 * @param query - The query whose graph to compile.
 * @param sourceResults - The results of the query the source node draws from, when it draws from a query.
 *
 * @returns The compiled graph, keyed by node ID.
 */
export function compileQueryGraph(
  query: Query,
  sourceResults: string[] | null = null,
): CompiledQueryGraph {
  const compiled: CompiledQueryGraph = {};

  // Process nodes in dependency order so inputs compile before
  // their consumers.
  const ordered = sortTopologically(query);

  ordered.forEach((node) => {
    // The compiled outputs of the node's incoming connections
    const inputs = query.connections
      .filter((connection) => connection.to === node.id)
      .map((connection) => compiled[connection.from])
      .filter(Boolean);

    // Merge the inputs' scopes, ORing parallel branches
    const inputScope = mergeScopes(inputs.map((input) => input.outputScope));

    // Accumulate upstream sorts in flow order, primary first
    const sorts = mergeSorts(inputs.map((input) => input.sorts));

    // Carry the smallest upstream limit
    const limit = mergeLimits(inputs.map((input) => input.limit));

    compiled[node.id] = compileNode(
      node,
      inputScope,
      sorts,
      limit,
      sourceResults,
    );
  });

  return compiled;
}

/**
 * Compiles a single node's operation onto its merged inputs.
 */
function compileNode(
  node: QueryNode,
  inputScope: EntryQueryScope | null,
  sorts: EntrySort[],
  limit: number | null,
  sourceResults: string[] | null,
): CompiledQueryNode {
  // Source nodes emit their database's entries, or the results
  // of the query they draw from.
  if (node.type === 'source') {
    return {
      inputScope,
      outputScope: compileSourceScope(node, sourceResults),
      sorts,
      inputLimit: limit,
      limit,
    };
  }

  // Filter nodes AND their comparison onto the input scope,
  // incomplete filters pass entries through unchanged
  if (node.type === 'filter') {
    const condition = convertQueryFilterNodeToEntryFilter(node);

    return {
      inputScope,
      outputScope: condition ? narrowScope(inputScope, condition) : inputScope,
      sorts,
      inputLimit: limit,
      limit,
    };
  }

  // Collection filter nodes narrow their input to the
  // collection's members, or to everything but them.
  if (node.type === 'collection-filter') {
    const memberIds = resolveCollectionFilterMembers(node);

    // A missing collection passes entries through unchanged, as
    // an unconfigured filter does.
    if (!memberIds) {
      return {
        inputScope,
        outputScope: inputScope,
        sorts,
        inputLimit: limit,
        limit,
      };
    }

    const condition: EntryIdFilter = {
      operator: node.operator === 'is-in' ? 'id-is-one-of' : 'id-is-not-one-of',
      entryIds: memberIds,
    };

    return {
      inputScope,
      outputScope: narrowScope(inputScope, condition),
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
      inputScope,
      outputScope: inputScope,
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
      inputScope,
      outputScope: inputScope,
      sorts,
      inputLimit: limit,
      limit: outputLimit,
    };
  }

  // Results nodes collect their input unchanged
  return {
    inputScope,
    outputScope: inputScope,
    sorts,
    inputLimit: limit,
    limit,
  };
}

/**
 * Builds the scope a source node emits: its database's entries
 * unfiltered, or the sourced query's database restricted to that
 * query's results.
 *
 * Restricting by result IDs rather than inlining the sourced
 * query's scope preserves its own sorts and limit, which a scope
 * filter cannot express.
 */
function compileSourceScope(
  node: QuerySourceNode,
  sourceResults: string[] | null,
): EntryQueryScope | null {
  const { source } = node;

  // An unpicked source emits nothing
  if (!source.id) {
    return null;
  }

  // Database sources emit all of the database's entries
  if (source.type === 'database') {
    return { databaseId: source.id, filter: null };
  }

  const sourced = getQuery(source.id, false);
  const databaseId = sourced ? getQueryDatabase(sourced) : null;

  // A query which is missing, has no database, or whose results
  // have not been resolved, emits nothing.
  if (!databaseId || !sourceResults) {
    return null;
  }

  return narrowScope(
    { databaseId, filter: null },
    { operator: 'id-is-one-of', entryIds: sourceResults },
  );
}

/**
 * ANDs a condition onto a scope's filter. A null scope stays
 * null, since it has no entries to narrow.
 */
function narrowScope(
  scope: EntryQueryScope | null,
  condition: EntryFilter | EntryFilterGroup,
): EntryQueryScope | null {
  if (!scope) {
    return null;
  }

  return {
    databaseId: scope.databaseId,
    filter: {
      combinator: 'and',
      filters: scope.filter ? [scope.filter, condition] : [condition],
    },
  };
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
 * Merges the scopes of parallel inputs, combining their filters
 * with OR. An unfiltered scope absorbs filtered ones, since it
 * already matches every entry. A single input's scope passes
 * through as is.
 */
function mergeScopes(
  scopes: (EntryQueryScope | null)[],
): EntryQueryScope | null {
  // Ignore inputs without entries
  const flowing = scopes.filter(
    (scope): scope is EntryQueryScope => scope !== null,
  );

  if (flowing.length === 0) {
    return null;
  }

  if (flowing.length === 1) {
    return flowing[0];
  }

  // Every input draws from the query's one database
  const { databaseId } = flowing[0];

  // An unfiltered branch already matches all of the database's
  // entries.
  if (flowing.some((scope) => !scope.filter)) {
    return { databaseId, filter: null };
  }

  return {
    databaseId,
    filter: {
      combinator: 'or',
      filters: flowing.flatMap((scope) => (scope.filter ? [scope.filter] : [])),
    },
  };
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
