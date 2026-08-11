import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
import {
  Queries,
  Query,
  QueryFilterNode,
  QueryFixtures,
} from '@minddrop/queries';
import { render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { QueryBuilderCanvas } from './QueryBuilderCanvas';

const { objectDatabase } = DatabaseFixtures;
const { query_1 } = QueryFixtures;

// The fixture query's nodes, connected source → filter → results
const [sourceNode, filterNode, resultsNode] = query_1.nodes;

// A first level filter valid for the source database
const filter1: QueryFilterNode = {
  ...(filterNode as QueryFilterNode),
  property: 'Content',
  propertyType: 'formatted-text',
};

// A second level filter for a property missing from the source
// database
const filter2: QueryFilterNode = {
  ...(filterNode as QueryFilterNode),
  id: 'query-node_filter-2',
  property: 'Domain',
  propertyType: 'text',
};

// The fixture query as a chain: source → filter1 → filter2 →
// results, with the invalid filter at the second level
const chainedQuery: Query = {
  ...query_1,
  nodes: [sourceNode, filter1, filter2, resultsNode],
  connections: [
    { id: 'query-connection_1', from: sourceNode.id, to: filter1.id },
    { id: 'query-connection_2', from: filter1.id, to: filter2.id },
    { id: 'query-connection_3', from: filter2.id, to: resultsNode.id },
  ],
};

// Mock query execution, which requires a SQL database
vi.mock('@minddrop/queries', async (importOriginal) => {
  const original = await importOriginal<typeof import('@minddrop/queries')>();

  return {
    ...original,
    Queries: {
      ...original.Queries,
      useResults: () => [],
      useNodeCounts: () => ({}),
    },
  };
});

describe('<QueryBuilderCanvas />', () => {
  beforeEach(() => {
    setup();

    // Load the query's source database
    Databases.Store.load([objectDatabase]);

    // Load the chained query
    Queries.Store.set(chainedQuery);
  });

  afterEach(() => {
    Databases.Store.clear();
    cleanup();
  });

  it('warns on an invalid filter deeper in a chain', () => {
    render(<QueryBuilderCanvas queryId={chainedQuery.id} />);

    expect(
      screen.getByText('An input does not contain this property'),
    ).toBeInTheDocument();
  });

  it('flags the connection trail into a chained invalid filter', () => {
    const { container } = render(
      <QueryBuilderCanvas queryId={chainedQuery.id} />,
    );

    // Both connections leading to the invalid filter are
    // flagged by the mismatch color, the connection out of it
    // is not
    const lines = Array.from(
      container.querySelectorAll('.ui-canvas-connection-line'),
    );
    const flagged = lines.filter((line) =>
      (line.getAttribute('style') || '').includes('--yellow-600'),
    );

    expect(flagged.length).toBe(2);
  });
});
