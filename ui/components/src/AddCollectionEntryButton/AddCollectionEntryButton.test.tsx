import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CollectionFixtures, Collections } from '@minddrop/collections';
import {
  DatabaseEntries,
  DatabaseEntry,
  DatabaseFixtures,
} from '@minddrop/databases';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { AddCollectionEntryButton } from './AddCollectionEntryButton';

const { collection_1 } = CollectionFixtures;
const {
  objectDatabase,
  collectionDatabase,
  objectEntry1,
  relatedEntry1,
  relatedEntry2,
} = DatabaseFixtures;

// Opens the add entry menu popup
async function openMenu() {
  await userEvent.click(
    screen.getByLabelText('collections.entries.actions.add'),
  );
}

// Types a query into the menu's search input
async function search(query: string) {
  await userEvent.type(screen.getByPlaceholderText('actions.search'), query);
}

describe('<AddCollectionEntryButton />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders the create option and newest entries for a single database', async () => {
    render(
      <AddCollectionEntryButton
        collectionId={collection_1.id}
        database={objectDatabase.id}
      />,
    );

    await openMenu();

    // The create option is labelled by the database entry name
    expect(screen.getByText(objectDatabase.entryName)).toBeInTheDocument();
    // The database's entries are listed
    expect(screen.getByText(objectEntry1.title)).toBeInTheDocument();
    // Entries from other databases are not listed
    expect(screen.queryByText(relatedEntry1.title)).toBeNull();
  });

  it('excludes entries already in the collection', async () => {
    // Load a collection containing an existing entry
    const collection = {
      ...collection_1,
      id: 'collection_test',
      items: [objectEntry1.id],
    };

    Collections.Store.load([collection]);

    render(
      <AddCollectionEntryButton
        collectionId={collection.id}
        database={objectDatabase.id}
      />,
    );

    await openMenu();

    // The collection member entry is not listed
    expect(screen.queryByText(objectEntry1.title)).toBeNull();
    // The create option is still listed
    expect(screen.getByText(objectDatabase.entryName)).toBeInTheDocument();
  });

  it('adds the selected entry to the collection', async () => {
    render(
      <AddCollectionEntryButton
        collectionId={collection_1.id}
        database={objectDatabase.id}
      />,
    );

    await openMenu();

    await userEvent.click(screen.getByText(objectEntry1.title));

    // The entry is added to the collection
    await waitFor(() => {
      expect(Collections.get(collection_1.id).items).toContain(objectEntry1.id);
    });
  });

  it('creates a new entry and adds it to the collection', async () => {
    render(
      <AddCollectionEntryButton
        collectionId={collection_1.id}
        database={objectDatabase.id}
      />,
    );

    await openMenu();

    await userEvent.click(screen.getByText(objectDatabase.entryName));

    await waitFor(() => {
      // A new entry exists in the database
      const entries = DatabaseEntries.getAll(objectDatabase.id);
      const newEntry = entries.find((entry) => entry.id !== objectEntry1.id);

      expect(newEntry).toBeDefined();
      // The new entry is added to the collection
      expect(Collections.get(collection_1.id).items).toContain(newEntry?.id);
    });
  });

  it('groups options when multiple databases are supported', async () => {
    render(
      <AddCollectionEntryButton
        collectionId={collection_1.id}
        database={[objectDatabase.id, collectionDatabase.id]}
      />,
    );

    await openMenu();

    // The group headings are rendered
    expect(
      screen.getByText('collections.entries.groups.new'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('collections.entries.groups.existing'),
    ).toBeInTheDocument();
    // Both databases have a create option
    expect(screen.getByText(objectDatabase.entryName)).toBeInTheDocument();
    expect(screen.getByText(collectionDatabase.entryName)).toBeInTheDocument();
    // Entries from both databases are listed
    expect(screen.getByText(objectEntry1.title)).toBeInTheDocument();
    expect(screen.getByText(relatedEntry1.title)).toBeInTheDocument();
  });

  it('supports all databases when database is false', async () => {
    render(
      <AddCollectionEntryButton
        collectionId={collection_1.id}
        database={false}
      />,
    );

    await openMenu();

    // All databases have a create option
    expect(screen.getByText(objectDatabase.entryName)).toBeInTheDocument();
    expect(screen.getByText(collectionDatabase.entryName)).toBeInTheDocument();
    expect(
      screen.getByText(DatabaseFixtures.urlDatabase.entryName),
    ).toBeInTheDocument();
  });

  it('limits entries to the 10 newest when not searching', async () => {
    // Load extra entries newer than the fixture entries
    const bulkEntries = Array.from(
      { length: 12 },
      (_, index): DatabaseEntry => ({
        ...objectEntry1,
        id: `database-entry_bulk-${index}`,
        title: `Bulk Entry ${index}`,
        created: new Date(2025, 0, index + 1),
      }),
    );

    DatabaseEntries.Store.load(bulkEntries);

    render(
      <AddCollectionEntryButton
        collectionId={collection_1.id}
        database={objectDatabase.id}
      />,
    );

    await openMenu();

    // Only the 10 newest entries are listed
    expect(screen.getAllByText(/Bulk Entry/).length).toBe(10);
    // The older fixture entry is cut off by the limit
    expect(screen.queryByText(objectEntry1.title)).toBeNull();
  });

  it('shows matching entries when searching, excluding collection members', async () => {
    // Load a collection containing one of the matching entries
    const collection = {
      ...collection_1,
      id: 'collection_test',
      items: [relatedEntry1.id],
    };

    Collections.Store.load([collection]);

    render(
      <AddCollectionEntryButton
        collectionId={collection.id}
        database={false}
      />,
    );

    await openMenu();
    await search('Related');

    // The matching entry is listed
    expect(screen.getByText(relatedEntry2.title)).toBeInTheDocument();
    // The collection member entry is not listed
    expect(screen.queryByText(relatedEntry1.title)).toBeNull();
  });

  it('shows create options for databases matching the search query', async () => {
    render(
      <AddCollectionEntryButton
        collectionId={collection_1.id}
        database={false}
      />,
    );

    await openMenu();
    await search('Storage');

    // All databases with a matching name or entry name have a
    // create option
    expect(
      screen.getByText(DatabaseFixtures.rootStorageDatabase.entryName),
    ).toBeInTheDocument();
    expect(
      screen.getByText(DatabaseFixtures.commonStorageDatabase.entryName),
    ).toBeInTheDocument();
    // Databases which do not match have no create option
    expect(screen.queryByText(objectDatabase.entryName)).toBeNull();
  });

  it('limits search results to the top 15 matched entries', async () => {
    // Load more matching entries than the search result limit
    const bulkEntries = Array.from(
      { length: 20 },
      (_, index): DatabaseEntry => ({
        ...objectEntry1,
        id: `database-entry_bulk-${index}`,
        title: `Bulk Entry ${index}`,
        created: new Date(2025, 0, index + 1),
      }),
    );

    DatabaseEntries.Store.load(bulkEntries);

    render(
      <AddCollectionEntryButton
        collectionId={collection_1.id}
        database={objectDatabase.id}
      />,
    );

    await openMenu();
    await search('Bulk');

    // Only the top 15 matched entries are listed
    expect(screen.getAllByText(/Bulk Entry/).length).toBe(15);
  });
});
