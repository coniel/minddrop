import { Databases } from '@minddrop/databases';
import { getQuery } from '../getQuery';
import { Query } from '../types';
import { QuerySourceResults, compileQueryGraph } from '../utils';

/**
 * Runs the queries a query's source nodes draw from, returning
 * their results keyed by query ID.
 *
 * Referenced queries are resolved depth first, so a query
 * sourcing another query gets its own references resolved
 * first. Queries already on the reference path are skipped,
 * which breaks reference cycles and self-references.
 *
 * @param query - The query whose references to resolve.
 *
 * @returns The referenced queries' results.
 */
export async function resolveQuerySourceResults(
  query: Query,
): Promise<QuerySourceResults> {
  return resolveReferences(query, new Set([query.id]));
}

/**
 * Resolves a query's referenced queries, tracking the queries
 * already on the reference path.
 */
async function resolveReferences(
  query: Query,
  visited: Set<string>,
): Promise<QuerySourceResults> {
  const results: QuerySourceResults = {};

  // The queries the graph's source nodes draw from
  const referencedIds = query.nodes.flatMap((node) =>
    node.type === 'source'
      ? node.sources
          .filter(
            (source) =>
              source.type === 'query' && source.id && !visited.has(source.id),
          )
          .map((source) => source.id)
      : [],
  );

  // Resolve each reference, running its own references first.
  // Several sources may draw from the same query, which is run
  // once.
  await Promise.all(
    Array.from(new Set(referencedIds)).map(async (queryId) => {
      const referenced = getQuery(queryId, false);

      // A missing query resolves to no results
      if (!referenced) {
        return;
      }

      const nested = await resolveReferences(
        referenced,
        new Set([...visited, queryId]),
      );

      results[queryId] = await runReferencedQuery(referenced, nested);
    }),
  );

  return results;
}

/**
 * Runs a referenced query's graph up to its results node.
 */
async function runReferencedQuery(
  query: Query,
  queryResults: QuerySourceResults,
): Promise<string[]> {
  const resultsNode = query.nodes.find((node) => node.type === 'results');

  // A query without a results node returns nothing
  if (!resultsNode) {
    return [];
  }

  const compiled = compileQueryGraph(query, queryResults)[resultsNode.id];

  return Databases.sql.queryScopedEntries(
    compiled.outputScopes,
    compiled.sorts,
    compiled.limit !== null ? { limit: compiled.limit } : undefined,
  );
}
