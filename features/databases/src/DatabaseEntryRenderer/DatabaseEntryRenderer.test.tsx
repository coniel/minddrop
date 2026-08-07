import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  DatabaseEntries,
  DatabaseEntrySerializers,
  DatabaseFixtures,
  Databases,
} from '@minddrop/databases';
import { DesignFixtures, Designs } from '@minddrop/designs';
import { render, screen } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { DatabaseEntryRenderer } from './DatabaseEntryRenderer';

const { objectEntry1, objectDatabase, defaultCardLayout } = DatabaseFixtures;
const {
  layout_list_1,
  layout_card_1,
  element_text_1,
  element_editor_1,
  design_books,
} = DesignFixtures;

// A text element bound to the 'Heading' design property, showing
// its placeholder rather than hiding when the value is unset
const boundTextElement = {
  ...element_text_1,
  property: 'Heading',
  emptyBehavior: 'placeholder' as const,
};

// A card layout whose only element is the bound text element
const boundLayout = {
  ...layout_card_1,
  id: 'bound-card',
  tree: { ...layout_card_1.tree, children: [boundTextElement] },
};

// The design's 'Heading' property, carrying a placeholder for the
// unmapped-render case (spread from a text property for its type)
const headingProperty = {
  ...design_books.properties[0],
  name: 'Heading',
  placeholder: 'Heading placeholder',
};

// A design declaring the 'Heading' property and the bound layout
const boundDesign = {
  ...design_books,
  id: 'design_bound' as const,
  properties: [headingProperty],
  layouts: [boundLayout],
};

// A database using the bound design. The design property map is
// supplied per-test to cover the mapped and unmapped cases.
function mappedDatabase(designPropertyMap: Record<string, string>) {
  return {
    ...objectDatabase,
    id: 'database_mapped' as const,
    name: 'MappedDb',
    path: `${objectDatabase.path}-mapped`,
    designId: boundDesign.id,
    designPropertyMap,
    defaultLayouts: {},
    properties: [{ ...design_books.properties[0], name: 'Body' }],
  };
}

// An entry in the mapped database with a value for the 'Body' property
const mappedEntry = {
  ...objectEntry1,
  id: 'database-entry_mapped-entry' as const,
  database: 'database_mapped' as const,
  path: `${objectDatabase.path}-mapped/Entry.md`,
  title: 'Mapped Entry',
  properties: { Body: 'Mapped Value' },
};

// An editor element with its title bound to the 'Heading' design
// property
const titleBoundEditorElement = {
  ...element_editor_1,
  titleProperty: 'Heading',
};

// A card layout whose only element is the title-bound editor
const titleBoundLayout = {
  ...layout_card_1,
  id: 'title-bound-card',
  tree: { ...layout_card_1.tree, children: [titleBoundEditorElement] },
};

// A design declaring the 'Heading' property and the title-bound
// layout
const titleBoundDesign = {
  ...design_books,
  id: 'design_title-bound' as const,
  properties: [headingProperty],
  layouts: [titleBoundLayout],
};

// A database using the title-bound design, mapping the 'Heading'
// design property to the implicit Title database property
const titleDatabase = {
  ...objectDatabase,
  id: 'database_title' as const,
  name: 'TitleDb',
  path: `${objectDatabase.path}-title`,
  designId: titleBoundDesign.id,
  designPropertyMap: { Heading: 'Title' },
  defaultLayouts: {},
  properties: [],
};

// An entry in the title database
const titleEntry = {
  ...objectEntry1,
  id: 'database-entry_title-entry' as const,
  database: 'database_title' as const,
  path: `${objectDatabase.path}-title/Title Entry.md`,
  title: 'Title Entry',
  properties: {},
};

describe('<DatabaseEntryRenderer />', () => {
  beforeEach(() => {
    setup();

    // Load the entry into the store so the renderer can resolve it
    DatabaseEntries.Store.load([objectEntry1]);
  });

  afterEach(() => {
    cleanup();
    DatabaseEntries.Store.clear();
    DatabaseEntrySerializers.Store.clear();
  });

  it('renders an entry using the default layout', () => {
    render(
      <DatabaseEntryRenderer entryId={objectEntry1.id} layoutContext="card" />,
    );

    // Layout fixture renders its ID as content
    screen.getByText(defaultCardLayout.id);
  });

  it('renders an entry using the specified layout', () => {
    render(
      <DatabaseEntryRenderer
        entryId={objectEntry1.id}
        layoutContext="list"
        layoutId={layout_list_1.id}
      />,
    );

    // Layout fixture renders its ID as content
    screen.getByText(layout_list_1.id);
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

  it('renders a bound element with the mapped database property value', () => {
    // Register the bound design and a database mapping Heading -> Body
    Designs.Store.load([boundDesign]);
    Databases.Store.load([mappedDatabase({ Heading: 'Body' })]);
    DatabaseEntries.Store.load([mappedEntry]);

    render(
      <DatabaseEntryRenderer
        entryId={mappedEntry.id}
        layoutContext="card"
        layoutId={boundLayout.id}
      />,
    );

    // The bound element resolves Heading -> Body -> the entry's value
    screen.getByText('Mapped Value');
  });

  it("renders the design property's placeholder when the property is unmapped", () => {
    // Register the bound design and a database with no property mapping
    Designs.Store.load([boundDesign]);
    Databases.Store.load([mappedDatabase({})]);
    DatabaseEntries.Store.load([mappedEntry]);

    render(
      <DatabaseEntryRenderer
        entryId={mappedEntry.id}
        layoutContext="card"
        layoutId={boundLayout.id}
      />,
    );

    // With no mapping, the element falls back to the design property placeholder
    screen.getByText('Heading placeholder');
  });

  it('renders the entry title in a title-bound editor element', () => {
    // Register the title-bound design and its database and entry
    Designs.Store.load([titleBoundDesign]);
    Databases.Store.load([titleDatabase]);
    DatabaseEntries.Store.load([titleEntry]);

    render(
      <DatabaseEntryRenderer
        entryId={titleEntry.id}
        layoutContext="card"
        layoutId={titleBoundLayout.id}
      />,
    );

    // The editor's title block resolves Heading -> Title -> the
    // entry title
    screen.getByText('Title Entry');
  });

  it('renders a title-only fallback when the database has no design', () => {
    // A database with no design and an entry belonging to it
    const noDesignDatabase = {
      ...objectDatabase,
      id: 'database_no-design' as const,
      name: 'NoDesignDb',
      path: `${objectDatabase.path}-no-design`,
      designId: null,
    };
    const noDesignEntry = {
      ...objectEntry1,
      id: 'database-entry_no-design-entry' as const,
      database: 'database_no-design' as const,
      path: `${objectDatabase.path}-no-design/Entry.md`,
      title: 'No Design Entry',
    };

    Databases.Store.load([noDesignDatabase]);
    DatabaseEntries.Store.load([noDesignEntry]);

    const { container } = render(
      <DatabaseEntryRenderer entryId={noDesignEntry.id} layoutContext="card" />,
    );

    // Falls back to a title-only fallback container showing the entry title
    expect(container.querySelector('.database-entry-fallback')).not.toBeNull();
    screen.getByText('No Design Entry');
  });
});
