import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Query, QuerySortNode } from '@minddrop/queries';
import { QueryFixtures } from '@minddrop/queries/test-utils';
import { render, screen } from '@minddrop/test-utils';
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
  propertyType: 'formatted-text',
  direction: 'ascending',
};

// Returns the fixture query with the sort node in place of the
// filter node
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

  afterEach(() => {
    Databases.Store.clear();
    cleanup();
  });

  it('warns when an input does not contain the sort property', () => {
    // A sort on a property missing from the source database
    const { query, node } = queryWithSort({
      property: 'Domain',
      propertyType: 'text',
    });

    render(<QuerySortNodeCard query={query} node={node} />);

    expect(
      screen.getByText('An input does not contain this property'),
    ).toBeInTheDocument();

    // The mismatched source is listed below the warning
    expect(screen.getByText(objectDatabase.name)).toBeInTheDocument();
  });

  it('does not warn when the input contains the sort property', () => {
    // A sort on a property of the source database
    const { query, node } = queryWithSort({
      property: 'Content',
      propertyType: 'formatted-text',
    });

    render(<QuerySortNodeCard query={query} node={node} />);

    expect(
      screen.queryByText('An input does not contain this property'),
    ).toBeNull();
  });
});
