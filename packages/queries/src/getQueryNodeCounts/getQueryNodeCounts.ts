import { Databases, EntryQueryScope } from '@minddrop/databases';
import { getQuery } from '../getQuery';
import { compileQueryGraph } from '../utils';

export interface QueryNodeCounts {
  /**
   * The number of unique entries flowing into the node, with
   * entries arriving over multiple connections counted once.
   */
  input: number;

  /**
   * The summed size of the node's incoming flows, with entries
   * arriving over multiple connections counted per connection.
   */
  inputTotal: number;

  /**
   * The number of entries flowing out of the node.
   */
  output: number;
}

/**
 * Counts the entries flowing into and out of each node of a
 * query's graph, capping counts by the limits accumulated along
 * the flow.
 *
 * Returns an empty record when the query does not exist.
 *
 * @param queryId - The ID of the query whose node counts to get.
 *
 * @returns The input/output counts keyed by node ID.
 */
export async function getQueryNodeCounts(
  queryId: string,
): Promise<Record<string, QueryNodeCounts>> {
  const query = getQuery(queryId, false);

  // No counts without a query
  if (!query) {
    return {};
  }

  const compiled = compileQueryGraph(query);

  // Count each distinct scope list once: pass-through nodes
  // share their input's scope list by reference
  const countCache = new Map<EntryQueryScope[], number>();

  const countScopes = async (scopes: EntryQueryScope[]): Promise<number> => {
    const cached = countCache.get(scopes);

    if (cached !== undefined) {
      return cached;
    }

    const count = await Databases.sql.countScopedEntries(scopes);

    countCache.set(scopes, count);

    return count;
  };

  const counts: Record<string, QueryNodeCounts> = {};

  // Count every node's unique input and output flows
  await Promise.all(
    query.nodes.map(async (node) => {
      const compiledNode = compiled[node.id];

      const [input, output] = await Promise.all([
        countScopes(compiledNode.inputScopes),
        countScopes(compiledNode.outputScopes),
      ]);

      // Cap the counts by the limits flowing through the node
      const limitedInput =
        compiledNode.inputLimit !== null
          ? Math.min(input, compiledNode.inputLimit)
          : input;
      const limitedOutput =
        compiledNode.limit !== null
          ? Math.min(output, compiledNode.limit)
          : output;

      counts[node.id] = {
        input: limitedInput,
        inputTotal: 0,
        output: limitedOutput,
      };
    }),
  );

  // Sum each node's incoming flows from its inputs' outputs,
  // counting entries once per connection they arrive over
  query.connections.forEach((connection) => {
    const target = counts[connection.to];
    const source = counts[connection.from];

    if (target && source) {
      target.inputTotal += source.output;
    }
  });

  return counts;
}
