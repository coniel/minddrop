import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DatabaseEntries, DatabaseEntry } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DatabaseEntriesSearchField } from './DatabaseEntriesSearchField';

const { objectEntry1, rootStorageEntry1 } = DatabaseFixtures;

// A second entry sharing objectEntry1's title
const duplicateTitleEntry: DatabaseEntry = {
  ...objectEntry1,
  id: 'database-entry_duplicate-title',
};

describe('<DatabaseEntriesSearchField />', () => {
  beforeEach(() => {
    setup();

    DatabaseEntries.Store.load([duplicateTitleEntry]);
  });

  afterEach(cleanup);

  it('returns every entry sharing a matched title', async () => {
    const onFilteredEntriesChange = vi.fn();

    render(
      <DatabaseEntriesSearchField
        entryIds={[objectEntry1.id, duplicateTitleEntry.id]}
        onFilteredEntriesChange={onFilteredEntriesChange}
      />,
    );

    await userEvent.type(
      screen.getByPlaceholderText('actions.search'),
      objectEntry1.title,
    );

    await waitFor(() => {
      expect(onFilteredEntriesChange).toHaveBeenLastCalledWith([
        objectEntry1.id,
        duplicateTitleEntry.id,
      ]);
    });
  });

  it('filters out entries which do not match', async () => {
    const onFilteredEntriesChange = vi.fn();

    render(
      <DatabaseEntriesSearchField
        entryIds={[objectEntry1.id, rootStorageEntry1.id]}
        onFilteredEntriesChange={onFilteredEntriesChange}
      />,
    );

    await userEvent.type(
      screen.getByPlaceholderText('actions.search'),
      rootStorageEntry1.title,
    );

    await waitFor(() => {
      expect(onFilteredEntriesChange).toHaveBeenLastCalledWith([
        rootStorageEntry1.id,
      ]);
    });
  });
});
