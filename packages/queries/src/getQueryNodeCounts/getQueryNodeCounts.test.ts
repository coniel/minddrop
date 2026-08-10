import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EntryQueryScope } from '@minddrop/databases';
import { QueriesStore } from '../QueriesStore';
import { cleanup, setup } from '../test-utils';
import { query_1 } from '../test-utils/queries.fixtures';
import { getQueryNodeCounts } from './getQueryNodeCounts';

// The fixture query's nodes, connected source → filter → results
const [sourceNode, filterNode, resultsNode] = query_1.nodes;

// Mock SQL counting: unfiltered scopes count 10, filtered 4
vi.mock('@minddrop/databases', async (importOriginal) => {
  const original = await importOriginal<typeof import('@minddrop/databases')>();

  return {
    ...original,
    Databases: {
      ...original.Databases,
      sql: {
        ...original.Databases.sql,
        countScopedEntries: (scopes: EntryQueryScope[]) => {
          if (scopes.length === 0) {
            return 0;
          }

          return scopes[0].filter ? 4 : 10;
        },
      },
    },
  };
});

describe('getQueryNodeCounts', () => {
  beforeEach(() => {
    setup({});
  });

  afterEach(cleanup);

  it('counts each node input and output flow', async () => {
    const counts = await getQueryNodeCounts(query_1.id);

    expect(counts[sourceNode.id]).toEqual({
      input: 0,
      inputTotal: 0,
      output: 10,
    });
    expect(counts[filterNode.id]).toEqual({
      input: 10,
      inputTotal: 10,
      output: 4,
    });
    expect(counts[resultsNode.id]).toEqual({
      input: 4,
      inputTotal: 4,
      output: 4,
    });
  });

  it('sums duplicate inputs from parallel branches separately', async () => {
    // A second filter branch from the source into the results
    // node, so entries matching both filters arrive twice
    QueriesStore.set({
      ...query_1,
      nodes: [...query_1.nodes, { ...filterNode, id: 'query-node_filter-b' }],
      connections: [
        ...query_1.connections,
        {
          id: 'query-connection_c',
          from: sourceNode.id,
          to: 'query-node_filter-b',
        },
        {
          id: 'query-connection_d',
          from: 'query-node_filter-b',
          to: resultsNode.id,
        },
      ],
    });

    const counts = await getQueryNodeCounts(query_1.id);

    // Both branches deliver 4 entries, 4 of which are unique
    expect(counts[resultsNode.id]).toEqual({
      input: 4,
      inputTotal: 8,
      output: 4,
    });
  });

  it('caps counts by upstream limits', async () => {
    // The fixture graph with a limit node between the filter
    // and the results node
    QueriesStore.set({
      ...query_1,
      nodes: [
        ...query_1.nodes,
        { id: 'query-node_limit', type: 'limit', x: 0, y: 0, count: 2 },
      ],
      connections: [
        query_1.connections[0],
        {
          id: 'query-connection_c',
          from: filterNode.id,
          to: 'query-node_limit',
        },
        {
          id: 'query-connection_d',
          from: 'query-node_limit',
          to: resultsNode.id,
        },
      ],
    });

    const counts = await getQueryNodeCounts(query_1.id);

    expect(counts['query-node_limit']).toEqual({
      input: 4,
      inputTotal: 4,
      output: 2,
    });
    expect(counts[resultsNode.id]).toEqual({
      input: 2,
      inputTotal: 2,
      output: 2,
    });
  });

  it('returns an empty record when the query does not exist', async () => {
    await expect(getQueryNodeCounts('missing')).resolves.toEqual({});
  });
});
