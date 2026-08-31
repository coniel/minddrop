import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { CollectionFixtures } from '@minddrop/collections/test-utils';
import { DatabaseEntries, DatabaseEntry, Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { AddCollectionEntryButton } from './AddCollectionEntryButton';

const { collection_1 } = CollectionFixtures;
const {
  objectDatabase,
  collectionDatabase,
  entryTemplatesDatabase,
  entryTemplate1,
  entryTemplate2,
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
  await userEvent.type(
    screen.getByPlaceholderText('collections.entries.searchPlaceholder'),
    query,
  );
}

// Returns the listed options matching the text. While searching,
// the menu keeps a hidden copy of every item for registration and
// renders the results separately, so hidden copies are dropped.
function listedOptions(text: string | RegExp): HTMLElement[] {
  return screen
    .queryAllByText(text)
    .filter((element) => !element.closest('[hidden]'));
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

  it("icons existing entries with their database's icon", async () => {
    render(
      <AddCollectionEntryButton
        collectionId={collection_1.id}
        database={objectDatabase.id}
      />,
    );

    await openMenu();

    // The entry's option carries an icon alongside its title
    const entryOption = screen
      .getByText(objectEntry1.title)
      .closest('.menu-item');

    expect(entryOption?.querySelector('.menu-item-icon')).not.toBeNull();
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

  it("nests a templated database's create options in a submenu", async () => {
    render(
      <AddCollectionEntryButton
        collectionId={collection_1.id}
        database={entryTemplatesDatabase.id}
      />,
    );

    await openMenu();

    // The templates are not listed at the root
    expect(screen.queryByText(entryTemplate1.name)).toBeNull();
    // The database has a single root option
    expect(screen.getAllByText(entryTemplatesDatabase.entryName).length).toBe(
      1,
    );

    // Open the database's submenu
    await userEvent.click(screen.getByText(entryTemplatesDatabase.entryName));

    // The submenu adds the blank entry option alongside the trigger
    await waitFor(() => {
      expect(screen.getAllByText(entryTemplatesDatabase.entryName).length).toBe(
        2,
      );
    });

    // The database's templates are listed in the submenu
    expect(screen.getByText(entryTemplate1.name)).toBeInTheDocument();
    expect(screen.getByText(entryTemplate2.name)).toBeInTheDocument();
  });

  it('creates an entry from the selected template and adds it to the collection', async () => {
    render(
      <AddCollectionEntryButton
        collectionId={collection_1.id}
        database={entryTemplatesDatabase.id}
      />,
    );

    await openMenu();

    // Open the database's submenu and pick the template
    await userEvent.click(screen.getByText(entryTemplatesDatabase.entryName));
    await userEvent.click(await screen.findByText(entryTemplate1.name));

    await waitFor(() => {
      // The templated entry exists in the database
      const entries = DatabaseEntries.getAll(entryTemplatesDatabase.id);
      const newEntry = entries.find(
        (entry) => entry.title === entryTemplate1.defaultTitle,
      );

      expect(newEntry).toBeDefined();
      // The template's property values are applied to the entry
      expect(newEntry?.properties.Notes).toBe(entryTemplate1.properties.Notes);
      // The new entry is added to the collection
      expect(Collections.get(collection_1.id).items).toContain(newEntry?.id);
    });
  });

  it('lists template create options flat while searching', async () => {
    render(
      <AddCollectionEntryButton
        collectionId={collection_1.id}
        database={entryTemplatesDatabase.id}
      />,
    );

    await openMenu();
    await search(entryTemplatesDatabase.entryName);

    // Template options are listed at the root, qualified by entry name
    expect(
      listedOptions(
        `${entryTemplatesDatabase.entryName} · ${entryTemplate1.name}`,
      ),
    ).toHaveLength(1);
  });

  it('matches templates by name while searching', async () => {
    // Give a database a template whose name shares nothing with its
    // database or entry name, so only a template match can list it
    Databases.Store.update(objectDatabase.id, {
      entryTemplates: [{ ...entryTemplate1, name: 'Zephyr' }],
    });

    render(
      <AddCollectionEntryButton
        collectionId={collection_1.id}
        database={false}
      />,
    );

    await openMenu();
    await search('Zephyr');

    // The matched template is listed
    expect(listedOptions(`${objectDatabase.entryName} · Zephyr`)).toHaveLength(
      1,
    );
    // Templates which do not match are not listed
    expect(listedOptions(new RegExp(entryTemplate2.name))).toHaveLength(0);
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
      screen.getByText('collections.entries.groups.recent'),
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
    expect(listedOptions(relatedEntry2.title)).toHaveLength(1);
    // The collection member entry is not listed
    expect(listedOptions(relatedEntry1.title)).toHaveLength(0);
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
      listedOptions(DatabaseFixtures.rootStorageDatabase.entryName),
    ).toHaveLength(1);
    expect(
      listedOptions(DatabaseFixtures.commonStorageDatabase.entryName),
    ).toHaveLength(1);
    // Databases which do not match have no create option
    expect(listedOptions(objectDatabase.entryName)).toHaveLength(0);
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
    expect(listedOptions(/Bulk Entry/)).toHaveLength(15);
  });
});
