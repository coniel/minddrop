import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Queries, QueryFixtures, QueryLimitNode } from '@minddrop/queries';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { QueryLimitNodeCard } from './QueryLimitNodeCard';

const { query_1 } = QueryFixtures;

// A limit node with no cap, added to the fixture query
const limitNode: QueryLimitNode = {
  id: 'query-node_limit',
  type: 'limit',
  x: 0,
  y: 0,
  count: 0,
};

const query = { ...query_1, nodes: [...query_1.nodes, limitNode] };

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

/**
 * Hosts the card inside a wrapper which focuses itself on any
 * mousedown, mimicking the canvas viewport's focus-scoped
 * shortcut handling.
 */
const FocusStealingHost: React.FC = () => (
  <div tabIndex={-1} onMouseDown={(event) => event.currentTarget.focus()}>
    <QueryLimitNodeCard query={query} node={limitNode} />
  </div>
);

/**
 * Hosts the card without any focus handling, to tell a broken
 * press apart from a canvas interaction.
 */
const PlainHost: React.FC = () => (
  <QueryLimitNodeCard query={query} node={limitNode} />
);

// Returns the query's limit node from the store
function getLimitNode(): QueryLimitNode {
  const updatedQuery = Queries.get(query.id);

  return updatedQuery.nodes.find(
    (node) => node.id === limitNode.id,
  ) as QueryLimitNode;
}

describe('<QueryLimitNodeCard />', () => {
  beforeEach(() => {
    setup();

    Queries.Store.load([query]);
  });

  afterEach(cleanup);

  it('increments the count on the first press', async () => {
    const user = userEvent.setup();

    render(<PlainHost />);

    await user.click(screen.getByLabelText('Increase'));

    await waitFor(() => {
      expect(getLimitNode().count).toBe(1);
    });
  });

  it('increments the count on the first press inside a focus stealing host', async () => {
    const user = userEvent.setup();

    render(<FocusStealingHost />);

    // Press the stepper's increment arrow once
    await user.click(screen.getByLabelText('Increase'));

    await waitFor(() => {
      expect(getLimitNode().count).toBe(1);
    });
  });

  it('clears the cap when stepping below the minimum', async () => {
    const user = userEvent.setup();

    // A query capped at a single result
    Queries.Store.load([
      {
        ...query,
        nodes: query.nodes.map((node) =>
          node.id === limitNode.id ? { ...limitNode, count: 1 } : node,
        ),
      },
    ]);

    render(
      <QueryLimitNodeCard query={query} node={{ ...limitNode, count: 1 }} />,
    );

    await user.click(screen.getByLabelText('Decrease'));

    // A cleared field means uncapped
    await waitFor(() => {
      expect(getLimitNode().count).toBe(0);
    });
  });
});
