import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SidebarGroups } from '@minddrop/app';
import { CollectionFixtures } from '@minddrop/collections/test-utils';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { QueryFixtures } from '@minddrop/queries/test-utils';
import { SpaceFixtures } from '@minddrop/spaces/test-utils';
import { TagFixtures } from '@minddrop/tags/test-utils';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { EntityGroupList } from '@minddrop/ui-entity-groups';
import { cleanup, setup } from '../test-utils';
import { SidebarGroupItem } from './SidebarGroupItem';

const { objectDatabase, objectEntry1 } = DatabaseFixtures;
const { dataView_gallery_1 } = DataViewFixtures;
const { space_1 } = SpaceFixtures;
const { collection_1 } = CollectionFixtures;
const { query_1 } = QueryFixtures;
const { tag_1 } = TagFixtures;

describe('<SidebarGroupItem />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('renders a database by name', () => {
    render(<SidebarGroupItem itemId={objectDatabase.id} />);

    expect(screen.getByText(objectDatabase.name)).toBeInTheDocument();
  });

  it('renders a database entry by title', () => {
    render(<SidebarGroupItem itemId={objectEntry1.id} />);

    expect(screen.getByText(objectEntry1.title)).toBeInTheDocument();
  });

  it('renders a data view by name', () => {
    render(<SidebarGroupItem itemId={dataView_gallery_1.id} />);

    expect(screen.getByText(dataView_gallery_1.name)).toBeInTheDocument();
  });

  it('renders a space by name', () => {
    render(<SidebarGroupItem itemId={space_1.id} />);

    expect(screen.getByText(space_1.name)).toBeInTheDocument();
  });

  it('renders a collection by name', () => {
    render(<SidebarGroupItem itemId={collection_1.id} />);

    expect(screen.getByText(collection_1.name)).toBeInTheDocument();
  });

  it('renders a query by name', () => {
    render(<SidebarGroupItem itemId={query_1.id} />);

    expect(screen.getByText(query_1.name)).toBeInTheDocument();
  });

  it('renders a tag by name', () => {
    render(<SidebarGroupItem itemId={tag_1.id} />);

    expect(screen.getByText(tag_1.name)).toBeInTheDocument();
  });

  it('renders nothing for an item of an unsupported type', () => {
    const { container } = render(<SidebarGroupItem itemId="workspace_1" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('opens the item when it is clicked', () =>
    new Promise<void>((done) => {
      Events.addListener(Databases.events.OpenView, 'test', (data) => {
        expect(data.databaseId).toBe(objectDatabase.id);
        Events.removeListener(Databases.events.OpenView, 'test');
        done();
      });

      render(<SidebarGroupItem itemId={objectDatabase.id} />);

      userEvent.click(screen.getByText(objectDatabase.name));
    }));

  it('carries the group actions in its menu', async () => {
    render(
      <EntityGroupList
        type={SidebarGroups.constants.Type}
        renderItem={(itemId) => <SidebarGroupItem itemId={itemId} />}
      />,
    );

    await userEvent.pointer({
      keys: '[MouseRight]',
      target: screen.getAllByText(objectEntry1.title)[0],
    });

    expect(
      await screen.findByText('entityGroups.item.remove'),
    ).toBeInTheDocument();
  });
});
