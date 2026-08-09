import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DatabaseEntries,
  DatabaseFixtures,
  Databases,
} from '@minddrop/databases';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { CreateDatabaseEntryButton } from './CreateDatabaseEntryButton';

const {
  objectDatabase,
  entryTemplatesDatabase,
  entryTemplate1,
  entryTemplate2,
} = DatabaseFixtures;

// Types a query into the menu's search input
async function search(query: string) {
  await userEvent.type(
    screen.getByPlaceholderText('databases.labels.databases'),
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

describe('<CreateDatabaseEntryButton />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('creates an entry directly when the database has no templates', async () => {
    const onCreateEntry = vi.fn();
    const initialCount = DatabaseEntries.getAll(objectDatabase.id).length;

    render(
      <CreateDatabaseEntryButton
        database={objectDatabase.id}
        onCreateEntry={onCreateEntry}
      />,
    );

    await userEvent.click(
      screen.getByLabelText('databases.entries.actions.create'),
    );

    await waitFor(() => {
      // A new entry exists in the database
      expect(DatabaseEntries.getAll(objectDatabase.id).length).toBe(
        initialCount + 1,
      );
      // The entry is forwarded to the callback
      expect(onCreateEntry).toHaveBeenCalled();
    });
  });

  it('opens a template menu when the database has templates', async () => {
    render(
      <CreateDatabaseEntryButton
        database={entryTemplatesDatabase.id}
        onCreateEntry={vi.fn()}
      />,
    );

    await userEvent.click(
      screen.getByLabelText('databases.entries.actions.create'),
    );

    // The blank entry option is listed first, followed by templates
    expect(
      screen.getByText('databases.entryTemplates.menus.blankEntry'),
    ).toBeInTheDocument();
    expect(screen.getByText(entryTemplate1.name)).toBeInTheDocument();
  });

  it('creates an entry from the selected template', async () => {
    const onCreateEntry = vi.fn();

    render(
      <CreateDatabaseEntryButton
        database={entryTemplatesDatabase.id}
        onCreateEntry={onCreateEntry}
      />,
    );

    await userEvent.click(
      screen.getByLabelText('databases.entries.actions.create'),
    );

    await userEvent.click(screen.getByText(entryTemplate1.name));

    await waitFor(() => {
      // The templated entry exists in the database
      const entry = DatabaseEntries.getAll(entryTemplatesDatabase.id).find(
        (databaseEntry) => databaseEntry.title === entryTemplate1.defaultTitle,
      );

      expect(entry).toBeDefined();
      // The template's property values are applied to the entry
      expect(entry?.properties.Notes).toBe(entryTemplate1.properties.Notes);
    });
  });

  describe('multiple databases', () => {
    function renderMultiDatabaseButton() {
      render(
        <CreateDatabaseEntryButton
          database={[objectDatabase.id, entryTemplatesDatabase.id]}
          onCreateEntry={vi.fn()}
        />,
      );
    }

    async function openMenu() {
      await userEvent.click(
        screen.getByLabelText('databases.entries.actions.create'),
      );
    }

    it("nests a templated database's options in a submenu", async () => {
      renderMultiDatabaseButton();

      await openMenu();

      // The templates are not listed at the root
      expect(listedOptions(entryTemplate1.name)).toHaveLength(0);

      // Open the templated database's submenu
      await userEvent.click(screen.getByText(entryTemplatesDatabase.name));

      // The blank entry option is listed before the templates
      await waitFor(() => {
        expect(
          listedOptions('databases.entryTemplates.menus.blankEntry'),
        ).toHaveLength(1);
      });
      expect(listedOptions(entryTemplate1.name)).toHaveLength(1);
    });

    it('lists databases without templates as plain options', async () => {
      renderMultiDatabaseButton();

      await openMenu();

      await userEvent.click(screen.getByText(objectDatabase.name));

      await waitFor(() => {
        // An entry is created directly, without a submenu
        expect(DatabaseEntries.getAll(objectDatabase.id).length).toBe(2);
      });
    });

    it('lists template options flat while searching', async () => {
      renderMultiDatabaseButton();

      await openMenu();
      await search(entryTemplatesDatabase.name);

      // Template options are listed at the root, qualified by
      // database name
      expect(
        listedOptions(
          `${entryTemplatesDatabase.name} · ${entryTemplate1.name}`,
        ),
      ).toHaveLength(1);
      // Databases which do not match are not listed
      expect(listedOptions(objectDatabase.name)).toHaveLength(0);
    });

    it('matches templates by name', async () => {
      // Give a database a template whose name shares nothing with
      // its database name, so only a template match can list it
      Databases.Store.update(objectDatabase.id, {
        entryTemplates: [{ ...entryTemplate1, name: 'Zephyr' }],
      });

      renderMultiDatabaseButton();

      await openMenu();
      await search('Zephyr');

      // The matched template is listed
      expect(listedOptions(`${objectDatabase.name} · Zephyr`)).toHaveLength(1);
      // Templates which do not match are not listed
      expect(listedOptions(new RegExp(entryTemplate2.name))).toHaveLength(0);
    });
  });
});
