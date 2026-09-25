import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { DatabaseEntries, Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Designs } from '@minddrop/designs-next';
import {
  DesignElementFixtures,
  DesignFixtures,
} from '@minddrop/designs-next/test-utils';
import { render, screen } from '@minddrop/test-utils';
import { StandInElementFixtures } from '@minddrop/ui-designs-next/test-utils';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { defaultGalleryViewOptions } from '../constants';
import { cleanup, setup } from '../test-utils';
import { GalleryViewOptions } from '../types';
import { GalleryViewComponent } from './GalleryView';

const { contentView_gallery_1 } = ContentViewFixtures;
const { objectDatabase, objectEntry1, defaultCardLayout } = DatabaseFixtures;
const { ownedCardDesign_1, ownedCardDesign_2 } = DesignFixtures;
const { titleDesignElement } = DesignElementFixtures;
const { elementConfig_value } = StandInElementFixtures;
const { workspace_1 } = WorkspaceFixtures;

// The object database with a text property. A design rendering the
// property is then distinct from one rendering the title.
const database = {
  ...objectDatabase,
  properties: [
    ...objectDatabase.properties,
    { type: 'text' as const, name: 'Summary' },
  ],
};

// An entry with a value for the text property
const entry = {
  ...objectEntry1,
  properties: { ...objectEntry1.properties, Summary: 'Entry summary' },
};

// A card design of the database rendering the entry title
const titleCardDesign = {
  ...ownedCardDesign_1,
  owner: database.id,
  elements: [
    {
      ...titleDesignElement,
      type: elementConfig_value.type,
      property: 'Title',
    },
  ],
};

// A card design of the database rendering the text property
const summaryCardDesign = {
  ...ownedCardDesign_2,
  owner: database.id,
  elements: [
    {
      ...titleDesignElement,
      type: elementConfig_value.type,
      property: 'Summary',
    },
  ],
};

// A gallery of the database
const view = {
  ...contentView_gallery_1,
  dataSource: { type: 'database' as const, id: database.id },
};

/**
 * Renders the gallery on the entry with the given options.
 *
 * @param options - The view options.
 */
function renderGallery(options: Partial<GalleryViewOptions> = {}) {
  render(
    <GalleryViewComponent
      view={{
        ...view,
        options: { ...view.options, ...defaultGalleryViewOptions, ...options },
      }}
      entries={[entry.id]}
    />,
  );
}

describe('<GalleryViewComponent />', () => {
  beforeEach(() => {
    setup();

    Databases.Store.load([database]);
    DatabaseEntries.Store.load([entry]);
    Databases.Store.update(database.id, {
      designs: [titleCardDesign.id, summaryCardDesign.id],
    });
    Designs.load([titleCardDesign, summaryCardDesign], workspace_1.id);
  });

  afterEach(cleanup);

  it("renders the cards with the database's default card design", () => {
    renderGallery();

    expect(screen.getByText(entry.title)).toBeInTheDocument();
    expect(screen.queryByText('Entry summary')).toBeNull();
  });

  it('renders the cards with the card design the view overrides', () => {
    renderGallery({
      cardDesignOverrides: { [database.id]: summaryCardDesign.id },
    });

    expect(screen.getByText('Entry summary')).toBeInTheDocument();
    expect(screen.queryByText(entry.title)).toBeNull();
  });

  it('renders the cards with the legacy layout when the database owns no card design', () => {
    Designs.Store.clear();

    renderGallery();

    // The layout fixture renders its ID as content
    expect(screen.getByText(defaultCardLayout.id)).toBeInTheDocument();
  });
});
