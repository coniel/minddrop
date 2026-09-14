import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Collections } from '@minddrop/collections';
import { CollectionFixtures } from '@minddrop/collections/test-utils';
import { DataView, DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { Database, DatabaseEntries, Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Queries } from '@minddrop/queries';
import { QueryFixtures } from '@minddrop/queries/test-utils';
import { Space, Spaces } from '@minddrop/spaces';
import { SpaceFixtures } from '@minddrop/spaces/test-utils';
import { Tags } from '@minddrop/tags';
import { TagFixtures } from '@minddrop/tags/test-utils';
import { fireEvent, render, screen, userEvent } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { EntitySearchMenu } from './EntitySearchMenu';

const { objectDatabase, objectEntry1 } = DatabaseFixtures;
const { dataView_gallery_1 } = DataViewFixtures;
const { space_1 } = SpaceFixtures;
const { collection_1, collection_virtual_1 } = CollectionFixtures;
const { query_1 } = QueryFixtures;
const { tag_1 } = TagFixtures;

// An entity of each type, created after everything the fixtures
// carry, so the recent list is theirs to fill.
const recentDatabase: Database = {
  ...objectDatabase,
  id: 'database_recent',
  name: 'Recent database',
  created: new Date('2026-03-01T00:00:00.000Z'),
};
const recentSpace: Space = {
  ...space_1,
  id: 'space_recent',
  name: 'Recent space',
  created: new Date('2026-03-02T00:00:00.000Z'),
};
const secondSpace: Space = {
  ...space_1,
  id: 'space_second',
  name: 'Second space',
  created: new Date('2026-02-28T00:00:00.000Z'),
};
const recentDataView: DataView = {
  ...dataView_gallery_1,
  id: 'data-view_recent',
  name: 'Recent view',
  created: new Date('2026-03-03T00:00:00.000Z'),
};

describe('<EntitySearchMenu />', () => {
  beforeEach(() => {
    setup();

    Databases.Store.load([recentDatabase]);
    Spaces.Store.load([recentSpace, secondSpace]);
    DataViews.Store.load([recentDataView]);
  });

  afterEach(cleanup);

  function init(props: Partial<React.ComponentProps<typeof EntitySearchMenu>>) {
    const selected: string[] = [];

    render(
      <EntitySearchMenu
        onSelect={(entityId) => selected.push(entityId)}
        {...props}
      />,
    );

    return { selected };
  }

  it('lists the most recent entities, mixing their types', () => {
    init({});

    expect(screen.getByText(recentDataView.name)).toBeInTheDocument();
    expect(screen.getByText(recentSpace.name)).toBeInTheDocument();
    expect(screen.getByText(recentDatabase.name)).toBeInTheDocument();
  });

  it('lists them newest first', () => {
    init({});

    const listed = screen
      .getAllByRole('menuitem')
      .map((item) => item.textContent);

    expect(listed.slice(0, 3)).toEqual([
      recentDataView.name,
      recentSpace.name,
      recentDatabase.name,
    ]);
  });

  it('lists no more than the limit', () => {
    init({ limit: 2 });

    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  it('leaves out the entities the consumer already holds', () => {
    init({ excludeIds: [recentSpace.id] });

    expect(screen.queryByText(recentSpace.name)).toBeNull();
    expect(screen.getByText(recentDatabase.name)).toBeInTheDocument();
  });

  it('fills the list up to the limit around what it leaves out', () => {
    // One type and one place, so the list can only fill by reaching
    // past the entity it leaves out.
    init({
      types: [Spaces.constants.EntityType],
      excludeIds: [recentSpace.id],
      limit: 1,
    });

    expect(screen.getByText(secondSpace.name)).toBeInTheDocument();
  });

  it('leaves out what the consumer holds from the search too', () => {
    init({ excludeIds: [recentSpace.id] });

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: recentSpace.name },
    });

    expect(screen.queryByText(recentSpace.name)).toBeNull();
  });

  it('lists only the types it was given', () => {
    init({ types: [Spaces.constants.EntityType] });

    expect(screen.getByText(recentSpace.name)).toBeInTheDocument();
    expect(screen.queryByText(recentDatabase.name)).toBeNull();
  });

  it('searches the listed types', () => {
    init({});

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: objectEntry1.title },
    });

    // Several fixture entries share the title, which is what the
    // search matches on.
    expect(screen.getAllByText(objectEntry1.title).length).toBeGreaterThan(0);
  });

  it('searches no type it was not given', () => {
    init({ types: [Spaces.constants.EntityType] });

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: objectEntry1.title },
    });

    expect(screen.queryByText(objectEntry1.title)).toBeNull();
  });

  it('lists collections, queries and tags', () => {
    init({
      types: [
        Collections.constants.EntityType,
        Queries.constants.EntityType,
        Tags.constants.EntityType,
      ],
    });

    expect(screen.getByText(collection_1.name)).toBeInTheDocument();
    expect(screen.getByText(query_1.name)).toBeInTheDocument();
    expect(screen.getByText(tag_1.name)).toBeInTheDocument();
  });

  it('leaves out virtual collections', () => {
    init({ types: [Collections.constants.EntityType] });

    expect(screen.queryByText(collection_virtual_1.name)).toBeNull();

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: collection_virtual_1.name },
    });

    expect(screen.queryByText(collection_virtual_1.name)).toBeNull();
  });

  it('hands over the picked entity', async () => {
    const { selected } = init({});

    await userEvent.click(screen.getByText(recentSpace.name));

    expect(selected).toEqual([recentSpace.id]);
  });

  it('ranks entries by when they were last changed', () => {
    // One entry made last, the other changed last, both newer than
    // the fixtures, so the order says which date they are ranked by.
    DatabaseEntries.Store.load([
      {
        ...objectEntry1,
        id: 'database-entry_made-last',
        title: 'Made last',
        created: new Date('2027-03-01T00:00:00.000Z'),
        lastModified: new Date('2027-01-01T00:00:00.000Z'),
      },
      {
        ...objectEntry1,
        id: 'database-entry_changed-last',
        title: 'Changed last',
        created: new Date('2027-01-01T00:00:00.000Z'),
        lastModified: new Date('2027-03-01T00:00:00.000Z'),
      },
    ]);

    init({ types: [DatabaseEntries.constants.EntityType], limit: 2 });

    const listed = screen
      .getAllByRole('menuitem')
      .map((item) => item.textContent);

    expect(listed).toEqual(['Changed last', 'Made last']);
  });
});
