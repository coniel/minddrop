import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
import { Queries, QueryFixtures, QuerySourceNode } from '@minddrop/queries';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { QuerySourceNodeCard } from './QuerySourceNodeCard';

const { objectDatabase, urlDatabase } = DatabaseFixtures;
const { query_1, query_2 } = QueryFixtures;

// The fixture query's source node, which emits the object
// database's entries
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

  afterEach(() => {
    Databases.Store.clear();
    cleanup();
  });

  it('shows the current sources', () => {
    render(<QuerySourceNodeCard queryId={query_1.id} node={sourceNode} />);

    expect(screen.getByText(objectDatabase.name)).toBeInTheDocument();
  });

  it('adds a database to the sources', async () => {
    const user = userEvent.setup();

    render(<QuerySourceNodeCard queryId={query_1.id} node={sourceNode} />);

    // Pick a second database
    await user.click(screen.getByText(objectDatabase.name));
    await user.click(screen.getByRole('option', { name: urlDatabase.name }));

    // Both databases feed the node
    await waitFor(() => {
      expect(getSourceNode().sources).toEqual([
        { type: 'database', id: objectDatabase.id },
        { type: 'database', id: urlDatabase.id },
      ]);
    });
  });

  it('adds a query to the sources', async () => {
    const user = userEvent.setup();

    render(<QuerySourceNodeCard queryId={query_1.id} node={sourceNode} />);

    // Pick a query alongside the database
    await user.click(screen.getByText(objectDatabase.name));
    await user.click(screen.getByRole('option', { name: query_2.name }));

    await waitFor(() => {
      expect(getSourceNode().sources).toEqual([
        { type: 'database', id: objectDatabase.id },
        { type: 'query', id: query_2.id },
      ]);
    });
  });

  it('removes a deselected source', async () => {
    const user = userEvent.setup();

    render(<QuerySourceNodeCard queryId={query_1.id} node={sourceNode} />);

    // Deselect the only source
    await user.click(screen.getByText(objectDatabase.name));
    await user.click(screen.getByRole('option', { name: objectDatabase.name }));

    await waitFor(() => {
      expect(getSourceNode().sources).toEqual([]);
    });
  });

  it('does not offer the query being edited', async () => {
    const user = userEvent.setup();

    render(<QuerySourceNodeCard queryId={query_1.id} node={sourceNode} />);

    await user.click(screen.getByText(objectDatabase.name));

    // A query drawing from itself would be a reference cycle
    expect(screen.queryByRole('option', { name: query_1.name })).toBeNull();
    expect(
      screen.getByRole('option', { name: query_2.name }),
    ).toBeInTheDocument();
  });

  it('separates databases and queries under group headings', async () => {
    const user = userEvent.setup();

    render(<QuerySourceNodeCard queryId={query_1.id} node={sourceNode} />);

    await user.click(screen.getByText(objectDatabase.name));

    expect(screen.getByText('Databases')).toBeInTheDocument();
    expect(screen.getByText('Queries')).toBeInTheDocument();
  });
});
