import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataView, DataViewTypes, DataViews } from '@minddrop/data-views';
import { DataViewFixtures } from '@minddrop/data-views/test-utils';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Events, OpenConfirmationDialogEventData } from '@minddrop/events';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import {
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
} from '@minddrop/ui-primitives';
import { cleanup, setup } from '../test-utils';
import { DataViewSettingsMenu } from './DataViewSettingsMenu';
import { DataViewSettingsMenuContent } from './DataViewSettingsMenuContent';

const { dataView_gallery_1, dataViewType_table } = DataViewFixtures;
const { urlDatabase } = DatabaseFixtures;

// The text rendered by the test type's settings menu
const TypeSettingsText = 'Table settings';

// A table view of the URL database
const tableView: DataView = {
  ...dataView_gallery_1,
  type: dataViewType_table.type,
  name: 'Links',
  dataSource: { type: 'database', id: urlDatabase.id },
};

// Opens the settings menu
async function openMenu() {
  await userEvent.click(screen.getByLabelText('View settings'));
}

describe('<DataViewSettingsMenu />', () => {
  beforeEach(() => {
    setup();

    // Give the table type a settings menu to render
    DataViewTypes.register({
      ...dataViewType_table,
      settingsMenu: () => <div>{TypeSettingsText}</div>,
    });
    DataViews.Store.load([tableView]);
  });

  afterEach(cleanup);

  it("renders the view type's settings", async () => {
    render(<DataViewSettingsMenu view={tableView} />);

    await openMenu();

    screen.getByText(TypeSettingsText);
  });

  it("omits the view type's settings when not wanted", () => {
    // The items need a menu around them
    render(
      <DropdownMenuRoot open>
        <DropdownMenuPortal>
          <DropdownMenuPositioner>
            <DropdownMenuContent>
              <DataViewSettingsMenuContent
                view={tableView}
                typeSettings={false}
              />
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownMenuRoot>,
    );

    expect(screen.queryByText(TypeSettingsText)).toBeNull();
    screen.getByDisplayValue(tableView.name);
  });

  it('renders the rename item with the view name', async () => {
    render(<DataViewSettingsMenu view={tableView} />);

    await openMenu();

    expect(screen.getByDisplayValue(tableView.name)).toBeInTheDocument();
  });

  it('renames the view', async () => {
    render(<DataViewSettingsMenu view={tableView} />);

    await openMenu();

    const input = screen.getByDisplayValue(tableView.name);

    await userEvent.clear(input);
    await userEvent.type(input, 'Bookmarks{enter}');

    await waitFor(() => {
      expect(DataViews.get(tableView.id).name).toBe('Bookmarks');
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

    render(<DataViewSettingsMenu view={tableView} />);

    await openMenu();
    await userEvent.click(screen.getByText('Delete view'));

    await waitFor(() => {
      expect(confirmation).not.toBeNull();
    });

    // The view survives until the deletion is confirmed
    expect(DataViews.get(tableView.id, false)).not.toBeNull();

    confirmation!.onConfirm();

    await waitFor(() => {
      expect(DataViews.get(tableView.id, false)).toBeNull();
    });

    Events.removeListener(
      Events.events.OpenConfirmationDialog,
      'test-confirmation',
    );
  });
});
