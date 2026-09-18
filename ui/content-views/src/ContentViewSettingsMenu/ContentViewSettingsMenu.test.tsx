import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  ContentView,
  ContentViewTypes,
  ContentViews,
} from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events, OpenConfirmationDialogEventData } from '@minddrop/events';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { cleanup, setup } from '../test-utils';
import { ContentViewSettingsMenu } from './ContentViewSettingsMenu';

const { contentView_gallery_1, contentViewType_table } = ContentViewFixtures;
const { urlDatabase } = DatabaseFixtures;

// The text rendered by the test type's settings menu
const TypeSettingsText = 'Table settings';

// A table view of the URL database
const tableView: ContentView = {
  ...contentView_gallery_1,
  type: contentViewType_table.type,
  name: 'Links',
  dataSource: { type: 'database', id: urlDatabase.id },
};

// Opens the settings menu
async function openMenu() {
  await userEvent.click(screen.getByLabelText('View settings'));
}

describe('<ContentViewSettingsMenu />', () => {
  beforeEach(() => {
    setup();

    // Give the table type a settings menu to render
    ContentViewTypes.register({
      ...contentViewType_table,
      settingsMenu: () => <div>{TypeSettingsText}</div>,
    });
    ContentViews.Store.load([tableView]);
  });

  afterEach(cleanup);

  it("renders the view type's settings", async () => {
    render(<ContentViewSettingsMenu view={tableView} />);

    await openMenu();

    screen.getByText(TypeSettingsText);
  });

  it('renders the rename item with the view name', async () => {
    render(<ContentViewSettingsMenu view={tableView} />);

    await openMenu();

    expect(screen.getByDisplayValue(tableView.name)).toBeInTheDocument();
  });

  it('renames the view', async () => {
    render(<ContentViewSettingsMenu view={tableView} />);

    await openMenu();

    const input = screen.getByDisplayValue(tableView.name);

    await userEvent.clear(input);
    await userEvent.type(input, 'Bookmarks{enter}');

    await waitFor(() => {
      expect(ContentViews.get(tableView.id).name).toBe('Bookmarks');
    });
  });

  it('deletes the view once confirmed', async () => {
    // Capture the confirmation the delete item asks for
    let confirmation: OpenConfirmationDialogEventData | null = null;

    Events.addListener(
      Events.events.OpenConfirmationDialog,
      'test-confirmation',
      (data) => {
        confirmation = data;
      },
    );

    render(<ContentViewSettingsMenu view={tableView} />);

    await openMenu();
    await userEvent.click(screen.getByText('Delete view'));

    await waitFor(() => {
      expect(confirmation).not.toBeNull();
    });

    // The view survives until the deletion is confirmed
    expect(ContentViews.get(tableView.id, false)).not.toBeNull();

    confirmation!.onConfirm();

    await waitFor(() => {
      expect(ContentViews.get(tableView.id, false)).toBeNull();
    });

    Events.removeListener(
      Events.events.OpenConfirmationDialog,
      'test-confirmation',
    );
  });
});
