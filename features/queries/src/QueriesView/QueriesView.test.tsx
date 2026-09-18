import React, { useEffect, useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { Queries, QueryGroups } from '@minddrop/queries';
import {
  QueryFixtures,
  QueryGroupFixtures,
} from '@minddrop/queries/test-utils';
import {
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '@minddrop/test-utils';
import { SubviewDescriptor, Views } from '@minddrop/views';
import { cleanup, setup } from '../test-utils';
import { QueriesView } from './QueriesView';

const { objectDatabase } = DatabaseFixtures;
const { query_1, query_2, queries } = QueryFixtures;
const { queryGroup_1, queryGroup_2 } = QueryGroupFixtures;

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

  afterEach(async () => {
    Databases.Store.clear();
    await cleanup();
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

    // Open the add menu and pick the new query action
    await user.click(screen.getByLabelText('Add query'));
    await user.click(await screen.findByText('New query'));

    // The new query is added to the store
    await waitFor(() => {
      expect(Queries.Store).toHaveItemCount(queries.length + 1);
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
  it('lists the queries under the groups holding them', async () => {
    await QueryGroups.addItem(queryGroup_1.id, query_1.id);

    render(
      <SubviewHarness>
        <QueriesView />
      </SubviewHarness>,
    );

    expect(
      within(getGroup(queryGroup_1.name)).getByText(query_1.name),
    ).toBeInTheDocument();
    expect(
      within(getGroup('Ungrouped')).getByText(query_2.name),
    ).toBeInTheDocument();
  });

  it("creates a query in a group from the group's add button", async () => {
    const user = userEvent.setup();

    render(
      <SubviewHarness>
        <QueriesView />
      </SubviewHarness>,
    );

    await user.click(
      within(getGroup(queryGroup_2.name)).getByLabelText('New query'),
    );

    await waitFor(() => {
      expect(QueryGroups.get(queryGroup_2.id).items).toHaveLength(1);
    });
  });

  it('lists the matches without their groups while searching', async () => {
    const user = userEvent.setup();

    await QueryGroups.addItem(queryGroup_1.id, query_1.id);

    render(
      <SubviewHarness>
        <QueriesView />
      </SubviewHarness>,
    );

    await user.type(
      screen.getByPlaceholderText('Search queries...'),
      query_1.name,
    );

    await waitFor(() => {
      expect(screen.queryByText(queryGroup_1.name)).toBeNull();
    });

    expect(screen.queryByText('Ungrouped')).toBeNull();
    expect(getListedNames()).toEqual([query_1.name]);
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
    Events.addListener(Views.events.SetSubview, 'test-subview', (data) =>
      setSubview(data.subview),
    );

    return () => Events.removeListener(Views.events.SetSubview, 'test-subview');
  }, []);

  return (
    <Views.SubviewProvider subview={subview}>{children}</Views.SubviewProvider>
  );
};

/**
 * Returns the element of the group with the given name.
 */
function getGroup(name: string): HTMLElement {
  return screen.getByText(name).closest('.entity-group') as HTMLElement;
}

/**
 * Returns the names of every query listed in the left column, in
 * the order they are shown.
 */
function getListedNames(): (string | null)[] {
  const list = document.querySelector(
    '.list-panel-view-list-items',
  ) as HTMLElement;

  return Array.from(list.querySelectorAll('.menu-item-label')).map(
    (label) => label.textContent,
  );
}
