import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SidebarGroups } from '@minddrop/app';
import { SidebarGroupFixtures } from '@minddrop/app/test-utils';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events } from '@minddrop/events';
import { OpenNewDatabaseDialogEvent } from '@minddrop/feature-databases';
import { SpaceFixtures } from '@minddrop/spaces/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { AppSidebar } from './AppSidebar';

const { objectDatabase, objectEntry1 } = DatabaseFixtures;
const { dataView_gallery_1 } = DataViewFixtures;
const { space_1 } = SpaceFixtures;

describe('<AppSidebar />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('lists the user groups and the ones the app provides', () => {
    render(<AppSidebar />);

    expect(
      screen.getByText(SidebarGroupFixtures.sidebarGroup_1.name),
    ).toBeInTheDocument();
    expect(screen.getByText('desktopApp.labels.library')).toBeInTheDocument();
    expect(screen.getByText('databases.labels.databases')).toBeInTheDocument();
  });

  it('renders each of a group items as the item its type calls for', () => {
    render(<AppSidebar />);

    expect(screen.getByText(objectEntry1.title)).toBeInTheDocument();
    expect(screen.getByText(dataView_gallery_1.name)).toBeInTheDocument();
    expect(screen.getByText(space_1.name)).toBeInTheDocument();
  });

  it('lists every database in the databases group', () => {
    render(<AppSidebar />);

    // Listed twice: once in the databases group, once in the user's
    // group holding it.
    expect(screen.getAllByText(objectDatabase.name)).toHaveLength(2);
  });

  it('opens the picker from a group add button', async () => {
    render(<AppSidebar />);

    // Every user group carries one, so the first group's is the
    // one under test.
    await userEvent.click(
      screen.getAllByLabelText('desktopApp.sidebarGroups.actions.addItem')[0],
    );

    expect(
      await screen.findByPlaceholderText(
        'desktopApp.sidebarGroups.picker.searchPlaceholder',
      ),
    ).toBeInTheDocument();
  });

  it('creates a database from the databases group add button', () =>
    new Promise<void>((done) => {
      Events.addListener(OpenNewDatabaseDialogEvent, 'test', () => {
        Events.removeListener(OpenNewDatabaseDialogEvent, 'test');
        done();
      });

      render(<AppSidebar />);

      userEvent.click(screen.getByLabelText('databases.actions.new'));
    }));

  it('names a new group in place, creating it once it is named', async () => {
    const storedGroups = SidebarGroups.getAll().length;

    render(<AppSidebar />);

    await userEvent.click(
      screen.getByLabelText('desktopApp.sidebar.create.label'),
    );
    await userEvent.click(await screen.findByText('entityGroups.labels.group'));

    const nameField = await screen.findByPlaceholderText(
      'entityGroups.name.placeholder',
    );

    // Nothing is stored until the group has a name
    expect(SidebarGroups.getAll()).toHaveLength(storedGroups);

    await userEvent.type(nameField, 'My new group{Enter}');

    // The group is created at the top of the list, where it was
    // named.
    await waitFor(() => {
      expect(SidebarGroups.getAll()).toHaveLength(storedGroups + 1);
    });

    expect(SidebarGroups.getAll()[0].name).toBe('My new group');
  });
});
