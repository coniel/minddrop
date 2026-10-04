import { Databases } from '@minddrop/databases';
import { getQuery } from '../getQuery';
import { Query } from '../types';
import { compileQueryGraph, getQuerySourceNode } from '../utils';

/**
 * Runs the query a query's source node draws from, returning its
 * results.
 *
 * The sourced query's own source query is run first, and so on
 * down the chain. Returns null when the source is not a query,
 * the sourced query is missing, or the chain loops back on
 * itself.
 *
 * @param query - The query whose source to resolve.
 *
 * @returns The sourced query's entry IDs, or null.
 */
export async function resolveQuerySourceResults(
  query: Query,
): Promise<string[] | null> {
  return resolveSource(query, new Set([query.id]));
}

/**
 * Resolves a query's sourced query, tracking the queries already
 * on the source chain.
 */
async function resolveSource(
  query: Query,
  visited: Set<string>,
): Promise<string[] | null> {
  const source = getQuerySourceNode(query)?.source;

  // Only query sources have results to resolve
  if (source?.type !== 'query' || !source.id) {
    return null;
  }

  // Stop at queries already on the chain
  if (visited.has(source.id)) {
    return null;
  }

  const sourced = getQuery(source.id, false);

  // A missing query resolves to no results
  if (!sourced) {
    return null;
  }

  // Run the sourced query's own source first
  const sourceResults = await resolveSource(
    sourced,
    new Set([...visited, source.id]),
  );

  return runSourcedQuery(sourced, sourceResults);
}

/**
 * Runs a sourced query's graph up to its results node.
 */
async function runSourcedQuery(
  query: Query,
  sourceResults: string[] | null,
): Promise<string[]> {
  const resultsNode = query.nodes.find((node) => node.type === 'results');

  // A query without a results node returns nothing
  if (!resultsNode) {
    return [];
  }

  const compiled = compileQueryGraph(query, sourceResults)[resultsNode.id];

  // A query without a usable source returns nothing
  if (!compiled.outputScope) {
    return [];
  }

  return Databases.sql.queryScopedEntries(
    [compiled.outputScope],
    compiled.sorts,
    compiled.limit !== null ? { limit: compiled.limit } : undefined,
  );
}
