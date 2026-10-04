import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Queries, Query, QuerySortNode } from '@minddrop/queries';
import { QueryFixtures } from '@minddrop/queries/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { QuerySortNodeCard } from './QuerySortNodeCard';

const { objectDatabase } = DatabaseFixtures;
const { query_1 } = QueryFixtures;

// A sort node fed directly by the fixture query's source
const sortNode: QuerySortNode = {
  id: 'query-node_sort',
  type: 'sort',
  x: 0,
  y: 0,
  property: 'Content',
  propertyType: 'content',
  direction: 'ascending',
};

// Returns the fixture query with the sort node in place of the
// filter node.
function queryWithSort(data: Partial<QuerySortNode>) {
  const node = { ...sortNode, ...data };

  return {
    query: {
      ...query_1,
      nodes: [query_1.nodes[0], node, query_1.nodes[2]],
      connections: [
        {
          id: 'query-connection_sort',
          from: query_1.nodes[0].id,
          to: node.id,
        },
      ],
    } as Query,
    node,
  };
}

// Mock node count execution, which requires a SQL database
vi.mock('@minddrop/queries', async (importOriginal) => {
  const original = await importOriginal<typeof import('@minddrop/queries')>();

  return {
    ...original,
    Queries: {
      ...original.Queries,
      useNodeCounts: () => ({}),
    },
  };
});

describe('<QuerySortNodeCard />', () => {
  beforeEach(() => {
    setup();

    // Load the query's source database
    Databases.Store.load([objectDatabase]);
  });

  afterEach(async () => {
    Databases.Store.clear();
    await cleanup();
  });

  it('persists a property change along with its type', async () => {
    const user = userEvent.setup();
    const { query, node } = queryWithSort({ property: '', propertyType: '' });

    render(<QuerySortNodeCard query={query} node={node} />);

    // Pick a property of the query's database
    await user.click(screen.getByText('Property'));
    await user.click(screen.getByRole('option', { name: 'Content' }));

    await waitFor(() => {
      const sort = Queries.get(query.id).nodes.find(
        (queryNode) => queryNode.id === node.id,
      ) as QuerySortNode;

      expect(sort.property).toBe('Content');
      expect(sort.propertyType).toBe('content');
    });
  });
});
