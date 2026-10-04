import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Queries, QueryFilterNode, QuerySourceNode } from '@minddrop/queries';
import { QueryFixtures } from '@minddrop/queries/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { QuerySourceNodeCard } from './QuerySourceNodeCard';

const { objectDatabase, urlDatabase } = DatabaseFixtures;
const { query_1, query_2 } = QueryFixtures;

// The fixture query's source node, which emits the object
// database's entries.
const sourceNode = query_1.nodes[0] as QuerySourceNode;

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

// Returns the query's source node from the store
function getSourceNode(): QuerySourceNode {
  const query = Queries.get(query_1.id);

  return query.nodes.find(
    (node) => node.id === sourceNode.id,
  ) as QuerySourceNode;
}

describe('<QuerySourceNodeCard />', () => {
  beforeEach(() => {
    setup();

    // Load the selectable databases
    Databases.Store.load([objectDatabase, urlDatabase]);
  });

  afterEach(async () => {
    Databases.Store.clear();
    await cleanup();
  });

  it('shows the current source', () => {
    render(<QuerySourceNodeCard queryId={query_1.id} node={sourceNode} />);

    expect(screen.getByText(objectDatabase.name)).toBeInTheDocument();
  });

  it('replaces the source with a picked database', async () => {
    const user = userEvent.setup();

    render(<QuerySourceNodeCard queryId={query_1.id} node={sourceNode} />);

    await user.click(screen.getByText(objectDatabase.name));
    await user.click(screen.getByRole('option', { name: urlDatabase.name }));

    await waitFor(() => {
      expect(getSourceNode().source).toEqual({
        type: 'database',
        id: urlDatabase.id,
      });
    });
  });

  it("resets filters on properties the new source's database lacks", async () => {
    const user = userEvent.setup();

    // Filter by the object database's content property, which
    // the URL database does not have.
    Queries.Store.set({
      ...query_1,
      nodes: query_1.nodes.map((queryNode) =>
        queryNode.type === 'filter'
          ? { ...queryNode, property: 'Content', propertyType: 'content' }
          : queryNode,
      ),
    });

    render(<QuerySourceNodeCard queryId={query_1.id} node={sourceNode} />);

    await user.click(screen.getByText(objectDatabase.name));
    await user.click(screen.getByRole('option', { name: urlDatabase.name }));

    await waitFor(() => {
      const filter = Queries.get(query_1.id).nodes.find(
        (queryNode) => queryNode.type === 'filter',
      ) as QueryFilterNode;

      expect(filter.property).toBe('');
    });
  });

  it('replaces the source with a picked query', async () => {
    const user = userEvent.setup();

    render(<QuerySourceNodeCard queryId={query_1.id} node={sourceNode} />);

    await user.click(screen.getByText(objectDatabase.name));
    await user.click(screen.getByRole('option', { name: query_2.name }));

    await waitFor(() => {
      expect(getSourceNode().source).toEqual({ type: 'query', id: query_2.id });
    });
  });

  it('does not offer the query being edited', async () => {
    const user = userEvent.setup();

    render(<QuerySourceNodeCard queryId={query_1.id} node={sourceNode} />);

    await user.click(screen.getByText(objectDatabase.name));

    // A query drawing from itself would be a source cycle
    expect(screen.queryByRole('option', { name: query_1.name })).toBeNull();
    expect(
      screen.getByRole('option', { name: query_2.name }),
    ).toBeInTheDocument();
  });

  it('does not offer queries whose source chain leads back to the query', async () => {
    const user = userEvent.setup();

    // query_2 draws from query_1, so query_1 drawing from
    // query_2 would be a source cycle.
    Queries.Store.set({
      ...query_2,
      nodes: query_2.nodes.map((node) =>
        node.type === 'source'
          ? { ...node, source: { type: 'query', id: query_1.id } }
          : node,
      ),
    });

    render(<QuerySourceNodeCard queryId={query_1.id} node={sourceNode} />);

    await user.click(screen.getByText(objectDatabase.name));

    expect(screen.queryByRole('option', { name: query_2.name })).toBeNull();
  });

  it('separates databases and queries under group headings', async () => {
    const user = userEvent.setup();

    render(<QuerySourceNodeCard queryId={query_1.id} node={sourceNode} />);

    await user.click(screen.getByText(objectDatabase.name));

    expect(screen.getByText('Databases')).toBeInTheDocument();
    expect(screen.getByText('Queries')).toBeInTheDocument();
  });
});
