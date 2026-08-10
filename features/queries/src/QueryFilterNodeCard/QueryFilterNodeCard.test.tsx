import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
import { Queries, QueryFilterNode, QueryFixtures } from '@minddrop/queries';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { QueryFilterNodeCard } from './QueryFilterNodeCard';

const { objectDatabase } = DatabaseFixtures;
const { query_1 } = QueryFixtures;

// The fixture query's filter node
const filterNode = query_1.nodes[1] as QueryFilterNode;

// Returns the fixture query with its filter node reconfigured
function queryWithFilter(data: Partial<QueryFilterNode>) {
  const node = { ...filterNode, ...data };

  return {
    query: {
      ...query_1,
      nodes: query_1.nodes.map((queryNode) =>
        queryNode.id === filterNode.id ? node : queryNode,
      ),
    },
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

describe('<QueryFilterNodeCard />', () => {
  beforeEach(() => {
    setup();

    // Load the query's source database
    Databases.Store.load([objectDatabase]);
  });

  afterEach(() => {
    Databases.Store.clear();
    cleanup();
  });

  it('persists a property change, resetting the operator and value', async () => {
    const user = userEvent.setup();

    render(
      <QueryFilterNodeCard
        query={query_1}
        node={filterNode}
        onStartConnection={vi.fn()}
        onCompleteConnection={vi.fn()}
      />,
    );

    // Pick an upstream database property
    await user.click(screen.getByText(filterNode.property));
    await user.click(screen.getByRole('option', { name: 'Content' }));

    // The node's property, type, operator and value update in
    // the store
    await waitFor(() => {
      const query = Queries.get(query_1.id);
      const node = query.nodes.find(
        (queryNode) => queryNode.id === filterNode.id,
      ) as QueryFilterNode;

      expect(node.property).toBe('Content');
      expect(node.propertyType).toBe('formatted-text');
      expect(node.operator).toBe('equals');
      expect(node.value).toBeUndefined();
    });
  });

  it('persists an operator change', async () => {
    const user = userEvent.setup();

    render(
      <QueryFilterNodeCard
        query={query_1}
        node={filterNode}
        onStartConnection={vi.fn()}
        onCompleteConnection={vi.fn()}
      />,
    );

    // Pick a different operator
    await user.click(screen.getByText('Contains'));
    await user.click(screen.getByRole('option', { name: 'Starts with' }));

    // The node's operator updates in the store, keeping the value
    await waitFor(() => {
      const query = Queries.get(query_1.id);
      const node = query.nodes.find(
        (queryNode) => queryNode.id === filterNode.id,
      ) as QueryFilterNode;

      expect(node.operator).toBe('starts-with');
      expect(node.value).toBe('foo');
    });
  });

  it('warns when an input does not contain the filter property', () => {
    // A filter for a property missing from the source database
    const { query, node } = queryWithFilter({
      property: 'Domain',
      propertyType: 'text',
    });

    render(
      <QueryFilterNodeCard
        query={query}
        node={node}
        onStartConnection={vi.fn()}
        onCompleteConnection={vi.fn()}
      />,
    );

    expect(
      screen.getByText('An input does not contain this property'),
    ).toBeInTheDocument();

    // The mismatched source is listed below the warning
    expect(screen.getByText(objectDatabase.name)).toBeInTheDocument();
  });

  it('does not warn when the input contains the filter property', () => {
    // A filter for a property of the source database
    const { query, node } = queryWithFilter({
      property: 'Content',
      propertyType: 'formatted-text',
    });

    render(
      <QueryFilterNodeCard
        query={query}
        node={node}
        onStartConnection={vi.fn()}
        onCompleteConnection={vi.fn()}
      />,
    );

    expect(
      screen.queryByText('An input does not contain this property'),
    ).toBeNull();
  });
});
