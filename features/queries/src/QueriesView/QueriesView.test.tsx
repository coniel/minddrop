import React, { useEffect, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { Queries } from '@minddrop/queries';
import { QueryFixtures } from '@minddrop/queries/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { SetSubviewEvent, SubviewDescriptor, Views } from '@minddrop/views';
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

    render(
      <SubviewHarness>
        <QueriesView />
      </SubviewHarness>,
    );

    // Click the query's list item
    await user.click(screen.getByText(query_2.name));

    // The query's builder renders its name input
    expect(screen.getByDisplayValue(query_2.name)).toBeInTheDocument();
  });

  it('creates and selects a new query', async () => {
    const user = userEvent.setup();

    render(
      <SubviewHarness>
        <QueriesView />
      </SubviewHarness>,
    );

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

    render(
      <SubviewHarness>
        <QueriesView />
      </SubviewHarness>,
    );

    // Type into the search input
    await user.type(
      screen.getByPlaceholderText('Search queries...'),
      'Query 2',
    );

    // Only the matching query remains listed
    const listedQueries = screen.getAllByRole('menuitem');

    expect(listedQueries.length).toBe(1);
    expect(listedQueries[0]).toHaveTextContent(query_2.name);
  });
});

/**
 * Stands in for the view area, providing the view's subview and
 * updating it when the view announces a new one.
 */
const SubviewHarness: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [subview, setSubview] = useState<SubviewDescriptor | null>(null);

  useEffect(() => {
    Events.addListener(SetSubviewEvent, 'test-subview', (data) =>
      setSubview(data.subview),
    );

    return () => Events.removeListener(SetSubviewEvent, 'test-subview');
  }, []);

  return (
    <Views.SubviewProvider subview={subview}>{children}</Views.SubviewProvider>
  );
};
