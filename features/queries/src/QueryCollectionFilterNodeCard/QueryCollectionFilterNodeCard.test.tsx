import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CollectionFixtures, Collections } from '@minddrop/collections';
import {
  Queries,
  QueryCollectionFilterNode,
  QueryFixtures,
} from '@minddrop/queries';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { QueryCollectionFilterNodeCard } from './QueryCollectionFilterNodeCard';

const { collection_1, collection_2, collection_virtual_1 } = CollectionFixtures;
const { query_1 } = QueryFixtures;

// A collection filter node referencing the first fixture
// collection
const collectionFilterNode: QueryCollectionFilterNode = {
  id: 'query-node_collection-filter',
  type: 'collection-filter',
  x: 0,
  y: 0,
  source: 'collection',
  collection: collection_1.id,
  operator: 'is-in',
};

// The fixture query with the collection filter node added
const query = {
  ...query_1,
  nodes: [...query_1.nodes, collectionFilterNode],
};

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

// Returns the query's collection filter node from the store
function getFilterNode(): QueryCollectionFilterNode {
  const updatedQuery = Queries.get(query_1.id);

  return updatedQuery.nodes.find(
    (node) => node.id === collectionFilterNode.id,
  ) as QueryCollectionFilterNode;
}

describe('<QueryCollectionFilterNodeCard />', () => {
  beforeEach(() => {
    setup();

    // Load the query containing the collection filter node
    Queries.Store.load([query]);

    // Load the collections offered by the card
    Collections.Store.load([collection_1, collection_2, collection_virtual_1]);
  });

  afterEach(() => {
    Collections.Store.clear();
    cleanup();
  });

  it('persists a collection change', async () => {
    const user = userEvent.setup();

    render(
      <QueryCollectionFilterNodeCard
        query={query}
        node={collectionFilterNode}
      />,
    );

    // Pick a different collection
    await user.click(screen.getByText(collection_1.name));
    await user.click(screen.getByRole('option', { name: collection_2.name }));

    await waitFor(() => {
      expect(getFilterNode().collection).toBe(collection_2.id);
    });
  });

  it('persists an operator change', async () => {
    const user = userEvent.setup();

    render(
      <QueryCollectionFilterNodeCard
        query={query}
        node={collectionFilterNode}
      />,
    );

    // Pick the negated membership operator
    await user.click(screen.getByText('Is in'));
    await user.click(screen.getByRole('option', { name: 'Is not in' }));

    await waitFor(() => {
      expect(getFilterNode().operator).toBe('is-not-in');
    });
  });

  it('persists a pick of any collection', async () => {
    const user = userEvent.setup();

    render(
      <QueryCollectionFilterNodeCard
        query={query}
        node={collectionFilterNode}
      />,
    );

    // Pick the any collection option
    await user.click(screen.getByText(collection_1.name));
    await user.click(screen.getByRole('option', { name: 'Any collection' }));

    // The node spans every collection, dropping the named one
    await waitFor(() => {
      expect(getFilterNode().source).toBe('any-collection');
      expect(getFilterNode().collection).toBe('');
    });
  });

  it('separates the named collections under a group heading', async () => {
    const user = userEvent.setup();

    render(
      <QueryCollectionFilterNodeCard
        query={query}
        node={collectionFilterNode}
      />,
    );

    // Open the collection picker
    await user.click(screen.getByText(collection_1.name));

    expect(screen.getByText('Collections')).toBeInTheDocument();
  });

  it('does not offer virtual collections', async () => {
    const user = userEvent.setup();

    render(
      <QueryCollectionFilterNodeCard
        query={query}
        node={collectionFilterNode}
      />,
    );

    // Open the collection picker
    await user.click(screen.getByText(collection_1.name));

    // The user managed collections are listed
    expect(
      screen.getByRole('option', { name: collection_2.name }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('option', { name: collection_virtual_1.name }),
    ).toBeNull();
  });
});
