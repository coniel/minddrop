import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PropertyFilter } from '@minddrop/filters';
import { PropertySchema } from '@minddrop/properties';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { FilterMenu } from './FilterMenu';

const urlProperty: PropertySchema = { type: 'url', name: 'URL' };
const properties = [urlProperty];

const urlContainsFoo: PropertyFilter = {
  property: 'URL',
  propertyType: 'url',
  operator: 'contains',
  value: 'foo',
};

// Opens the filter menu
async function openMenu() {
  await userEvent.click(screen.getByLabelText('Filter'));
}

describe('<FilterMenu />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('lists the properties while there are no filters', async () => {
    renderMenu([]);

    await openMenu();

    expect(
      screen.getByPlaceholderText('Search properties'),
    ).toBeInTheDocument();
    expect(screen.getByText('URL')).toBeInTheDocument();
  });

  it('adds a filter on done', async () => {
    const reported = renderMenu([]);

    await openMenu();
    await userEvent.click(screen.getByText('URL'));

    // The form opens on the picked property with its first
    // operator, not done until it has a value.
    expect(await screen.findByText('Done')).toBeDisabled();

    await userEvent.type(screen.getByPlaceholderText('Value'), 'foo');
    await userEvent.click(screen.getByText('Done'));

    await waitFor(() => {
      expect(reported.filters).toEqual([
        {
          property: 'URL',
          propertyType: 'url',
          operator: 'equals',
          value: 'foo',
        },
      ]);
    });
  });

  it('discards a cancelled filter', async () => {
    const reported = renderMenu([]);

    await openMenu();
    await userEvent.click(screen.getByText('URL'));
    await userEvent.type(await screen.findByPlaceholderText('Value'), 'foo');
    await userEvent.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Value')).not.toBeInTheDocument();
    });
    expect(reported.filters).toBeUndefined();
  });

  it('highlights the button while there are filters', () => {
    renderMenu([urlContainsFoo]);

    expect(screen.getByLabelText('Filter')).toHaveClass(
      'icon-button-highlighted',
    );
  });

  it('lists the existing filters', async () => {
    renderMenu([urlContainsFoo]);

    await openMenu();

    expect(screen.getByText('URL')).toBeInTheDocument();
    expect(screen.getByText('contains foo')).toBeInTheDocument();
  });

  it('edits a filter in place', async () => {
    const reported = renderMenu([urlContainsFoo]);

    await openMenu();
    await userEvent.click(screen.getByText('URL'));

    // Pick another operator in the editor
    await userEvent.click(await screen.findByText('contains'));
    await userEvent.click(screen.getByRole('option', { name: 'starts with' }));

    await waitFor(() => {
      expect(reported.filters).toEqual([
        { ...urlContainsFoo, operator: 'starts-with' },
      ]);
    });
  });

  it('removes a filter', async () => {
    const reported = renderMenu([urlContainsFoo]);

    await openMenu();
    await userEvent.click(screen.getByText('URL'));
    await userEvent.click(await screen.findByText('Remove filter'));

    await waitFor(() => {
      expect(reported.filters).toEqual([]);
    });
  });

  it('opens the property picker from the add item', async () => {
    renderMenu([urlContainsFoo]);

    await openMenu();
    await userEvent.click(screen.getByText('Add filter'));

    expect(
      await screen.findByPlaceholderText('Search properties'),
    ).toBeInTheDocument();
  });
});

interface TrackedMenuProps {
  initialFilters: PropertyFilter[];
  reported: { filters?: PropertyFilter[] };
}

/**
 * Renders the menu with its filters fed back, recording the last
 * reported filters.
 */
function TrackedMenu({ initialFilters, reported }: TrackedMenuProps) {
  const [filters, setFilters] = useState(initialFilters);

  function handleFiltersChange(changed: PropertyFilter[]): void {
    // Record and feed back the change
    reported.filters = changed;
    setFilters(changed);
  }

  return (
    <FilterMenu
      filters={filters}
      onFiltersChange={handleFiltersChange}
      properties={properties}
    />
  );
}

/**
 * Renders the menu on the given filters and returns a holder of
 * the last reported filters.
 */
function renderMenu(initialFilters: PropertyFilter[]) {
  const reported: { filters?: PropertyFilter[] } = {};

  render(<TrackedMenu initialFilters={initialFilters} reported={reported} />);

  return reported;
}
