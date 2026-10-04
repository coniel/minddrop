import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  DatabaseEntries,
  Databases,
  EntrySerializers,
} from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import {
  DesignElementConfigs,
  Designs as DesignsNext,
} from '@minddrop/designs-next';
import {
  DesignElementConfigsRegistry,
  DesignElementFixtures,
  DesignFixtures as DesignNextFixtures,
} from '@minddrop/designs-next/test-utils';
import { storeItem } from '@minddrop/stores/test-utils';
import { fireEvent, render, screen, waitFor } from '@minddrop/test-utils';
import { DatabaseEntryContextProvider } from '@minddrop/ui-databases';
import { StandInElementFixtures } from '@minddrop/ui-designs-next/test-utils';
import { MockFs, cleanup, setup } from '../test-utils';
import { DatabaseEntryRenderer } from './DatabaseEntryRenderer';

const { objectEntry1, objectDatabase, databaseDirPath } = DatabaseFixtures;
const { ownedCardDesign_1 } = DesignNextFixtures;
const { titleDesignElement } = DesignElementFixtures;
const { elementConfig_value, elementConfig_edit } = StandInElementFixtures;

// A database with a text property. Only a design renders the
// property's value. The title-only fallback does not show it.
const designDatabase = {
  ...objectDatabase,
  id: 'database_design' as const,
  name: 'DesignDb',
  path: `${objectDatabase.path}-design`,
  properties: [{ type: 'text' as const, name: 'Body' }],
};

const designEntry = {
  ...objectEntry1,
  id: 'database-entry_design-entry' as const,
  database: designDatabase.id,
  path: 'Entry.md',
  title: 'Design Entry',
  properties: { Body: 'Design value' },
};

// A card design mapping its only element to the Body property
const bodyMappedDesign = {
  ...ownedCardDesign_1,
  elements: [
    { ...titleDesignElement, type: elementConfig_value.type, property: 'Body' },
  ],
};

// A second entry in the design database. Its title is invalid for
// the other entries.
const otherDesignEntry = {
  ...designEntry,
  id: 'database-entry_other-design-entry' as const,
  path: 'Other Entry.md',
  title: 'Other Entry',
};

/**
 * Builds a card design whose only element writes and validates the
 * given content against the Body property.
 *
 * @param content - The content the element writes.
 * @returns The design.
 */
function bodyEditDesign(content: string) {
  return {
    ...ownedCardDesign_1,
    elements: [
      {
        ...titleDesignElement,
        type: elementConfig_edit.type,
        property: 'Body',
        content,
      },
    ],
  };
}

/**
 * Builds a card design whose only element writes and validates the
 * given content against the entry title.
 *
 * @param content - The content the element writes.
 * @returns The design.
 */
function titleEditDesign(content: string) {
  return {
    ...ownedCardDesign_1,
    elements: [
      {
        ...titleDesignElement,
        type: elementConfig_edit.type,
        property: 'Title',
        content,
      },
    ],
  };
}

// The same design, owned by the entry's database
const ownedBodyMappedDesign = {
  ...bodyMappedDesign,
  id: 'design_owned-body-mapped' as const,
  owner: designDatabase.id,
};

describe('<DatabaseEntryRenderer />', () => {
  beforeEach(() => {
    setup();

    // Load the entry into the store so the renderer can resolve it
    DatabaseEntries.Store.load([objectEntry1]);

    // Register the element types the designs render
    DesignElementConfigs.register(elementConfig_value);
    DesignElementConfigs.register(elementConfig_edit);
  });

  afterEach(async () => {
    await cleanup();
    DatabaseEntries.Store.clear();
    EntrySerializers.Store.clear();
    DesignElementConfigsRegistry.clear();
  });

  it('renders an entry with the design its database owns', () => {
    Databases.Store.load([designDatabase]);
    DatabaseEntries.Store.load([designEntry]);
    DesignsNext.Store.load([ownedBodyMappedDesign]);

    render(
      <DatabaseEntryRenderer entryId={designEntry.id} layoutContext="card" />,
    );

    // The design's element resolves the entry's Body value
    screen.getByText(designEntry.properties.Body);
  });

  it('renders an entry with the design it is given', () => {
    Databases.Store.load([designDatabase]);
    DatabaseEntries.Store.load([designEntry]);

    render(
      <DatabaseEntryRenderer
        entryId={designEntry.id}
        layoutContext="card"
        design={bodyMappedDesign}
      />,
    );

    screen.getByText(designEntry.properties.Body);
  });

  it('renders the entry title alone when given no design', () => {
    // The database owns a design, which the given null overrides
    Databases.Store.load([designDatabase]);
    DatabaseEntries.Store.load([designEntry]);
    DesignsNext.Store.load([ownedBodyMappedDesign]);

    render(
      <DatabaseEntryRenderer
        entryId={designEntry.id}
        layoutContext="card"
        design={null}
      />,
    );

    screen.getByText(designEntry.title);
    expect(screen.queryByText(designEntry.properties.Body)).toBeNull();
  });

  it("writes a design element's value to the entry", async () => {
    Databases.Store.load([designDatabase]);
    DatabaseEntries.Store.load([designEntry]);
    // Add the database's directory and load the serializers. The
    // update writes the entry file through them.
    MockFs.addFiles([databaseDirPath(designDatabase)]);
    EntrySerializers.loadCoreSerializers();

    render(
      <DatabaseEntryRenderer
        entryId={designEntry.id}
        layoutContext="card"
        design={bodyEditDesign('Edited value')}
      />,
    );

    fireEvent.click(screen.getByText('edit'));

    await waitFor(() => {
      expect(
        storeItem(DatabaseEntries.Store, designEntry.id).properties.Body,
      ).toBe('Edited value');
    });
  });

  it("rejects a design element's title which another entry has", () => {
    Databases.Store.load([designDatabase]);
    DatabaseEntries.Store.load([designEntry, otherDesignEntry]);

    render(
      <DatabaseEntryRenderer
        entryId={designEntry.id}
        layoutContext="card"
        design={titleEditDesign(otherDesignEntry.title)}
      />,
    );

    expect(screen.getByTestId('validation').textContent).not.toBe('valid');
  });

  it("accepts a design element's title which no entry has", () => {
    Databases.Store.load([designDatabase]);
    DatabaseEntries.Store.load([designEntry, otherDesignEntry]);

    render(
      <DatabaseEntryRenderer
        entryId={designEntry.id}
        layoutContext="card"
        design={titleEditDesign('Unused title')}
      />,
    );

    expect(screen.getByTestId('validation').textContent).toBe('valid');
  });

  it('validates only the title of a design element', () => {
    Databases.Store.load([designDatabase]);
    DatabaseEntries.Store.load([designEntry, otherDesignEntry]);

    render(
      <DatabaseEntryRenderer
        entryId={designEntry.id}
        layoutContext="card"
        design={bodyEditDesign(otherDesignEntry.title)}
      />,
    );

    expect(screen.getByTestId('validation').textContent).toBe('valid');
  });

  it('returns null if the entry does not exist', () => {
    const { container } = render(
      <DatabaseEntryRenderer
        entryId="non-existent-entry"
        layoutContext="card"
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('tints the entry with its meta color', () => {
    // Give the entry a color
    DatabaseEntries.Store.load([
      { ...objectEntry1, metadata: { color: 'red' } },
    ]);

    const { container } = render(
      <DatabaseEntryRenderer entryId={objectEntry1.id} layoutContext="card" />,
    );

    expect(
      container.querySelector('.database-entry.scheme-red'),
    ).not.toBeNull();
  });

  it('tints the entry by its select option color', () => {
    // A database coloring entries by a select property
    const statusDatabase = {
      ...objectDatabase,
      id: 'database_status' as const,
      name: 'StatusDb',
      path: `${objectDatabase.path}-status`,
      colorProperty: 'Status',
      properties: [
        {
          type: 'select' as const,
          name: 'Status',
          options: [{ value: 'Done', color: 'green' as const }],
        },
      ],
    };
    const statusEntry = {
      ...objectEntry1,
      id: 'database-entry_status-entry' as const,
      database: 'database_status' as const,
      path: `${objectDatabase.path}-status/Entry.md`,
      properties: { Status: 'Done' },
    };

    Databases.Store.load([statusDatabase]);
    DatabaseEntries.Store.load([statusEntry]);

    const { container } = render(
      <DatabaseEntryRenderer entryId={statusEntry.id} layoutContext="card" />,
    );

    expect(
      container.querySelector('.database-entry.scheme-green'),
    ).not.toBeNull();
  });

  it('applies no scheme class to uncolored entries', () => {
    const { container } = render(
      <DatabaseEntryRenderer entryId={objectEntry1.id} layoutContext="card" />,
    );

    expect(container.querySelector('[class*="scheme-"]')).toBeNull();
  });

  it('renders the entry title alone when its database owns no design', () => {
    Databases.Store.load([designDatabase]);
    DatabaseEntries.Store.load([designEntry]);

    render(
      <DatabaseEntryRenderer entryId={designEntry.id} layoutContext="card" />,
    );

    screen.getByText(designEntry.title);
    expect(screen.queryByText(designEntry.properties.Body)).toBeNull();
  });

  it('opens the entry options menu on right click when enabled', async () => {
    const { container } = render(
      <DatabaseEntryContextProvider contextMenu>
        <DatabaseEntryRenderer entryId={objectEntry1.id} layoutContext="card" />
      </DatabaseEntryContextProvider>,
    );

    fireEvent.contextMenu(container.querySelector('.database-entry')!);

    await waitFor(() => screen.getByText('actions.duplicate'));
  });

  it('does not open a menu on right click unless enabled', () => {
    const { container } = render(
      <DatabaseEntryRenderer entryId={objectEntry1.id} layoutContext="card" />,
    );

    fireEvent.contextMenu(container.querySelector('.database-entry')!);

    expect(screen.queryByText('actions.duplicate')).toBeNull();
  });
});
