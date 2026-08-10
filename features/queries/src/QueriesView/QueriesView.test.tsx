import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
import { Queries, QueryFixtures } from '@minddrop/queries';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { QueriesView } from './QueriesView';

const { objectDatabase } = DatabaseFixtures;
const { query_1, query_2, queries } = QueryFixtures;

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

describe('<QueriesView />', () => {
  beforeEach(() => {
    setup();

    // Load the queries' source database
    Databases.Store.load([objectDatabase]);
  });

  afterEach(() => {
    Databases.Store.clear();
    cleanup();
  });

  it('shows the clicked query in the builder canvas', async () => {
    const user = userEvent.setup();

    render(<QueriesView />);

    // Click the query's list item
    await user.click(screen.getByText(query_2.name));

    // The query's builder renders its name input
    expect(screen.getByDisplayValue(query_2.name)).toBeInTheDocument();
  });

  it('creates and selects a new query', async () => {
    const user = userEvent.setup();

    render(<QueriesView />);

    // Click the new query action
    await user.click(screen.getByLabelText('New query'));

    // The new query is added to the store
    await waitFor(() => {
      expect(Queries.Store.getAllArray().length).toBe(queries.length + 1);
    });

    // The new query's builder renders its name input
    const newQuery = Queries.Store.getAllArray().find(
      (query) => !queries.some((fixture) => fixture.id === query.id),
    )!;

    await waitFor(() => {
      expect(screen.getByDisplayValue(newQuery.name)).toBeInTheDocument();
    });
  });

  it('filters the query list by search', async () => {
    const user = userEvent.setup();

    render(<QueriesView />);

    // Type into the search input
    await user.type(screen.getByPlaceholderText('Search queries'), 'Query 2');

    // Only the matching query remains listed
    expect(screen.queryByText(query_1.name)).toBeNull();
    expect(screen.getByText(query_2.name)).toBeInTheDocument();
  });

  it('deletes the query on delete action click', async () => {
    const user = userEvent.setup();

    render(<QueriesView />);

    // Click the first query's delete action
    await user.click(screen.getAllByLabelText('Delete query')[0]);

    // The query is removed from the store
    await waitFor(() => {
      expect(Queries.get(query_1.id, false)).toBeNull();
    });
  });
});
