import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
import { DesignFixtures, Designs } from '@minddrop/designs';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { setup as baseSetup, cleanup } from '../test-utils';
import { DatabaseLayoutsMenu } from './DatabaseLayoutsMenu';

const { objectDatabase } = DatabaseFixtures;
const { layout_card_1, layout_card_2, layout_list_1 } = DesignFixtures;

function setup() {
  baseSetup();

  // Load designs into the store (which makes their inner layouts queryable)
  Designs.Store.load(DesignFixtures.designs);
}

describe('<DatabaseLayoutsMenu />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();
    Designs.Store.clear();
  });

  it('renders mapped layouts grouped by type', () => {
    render(<DatabaseLayoutsMenu databaseId={objectDatabase.id} />);

    // Should render mapped layouts
    screen.getByText(layout_card_1.name);
    screen.getByText(layout_card_2.name);
    screen.getByText(layout_list_1.name);
  });

  it('sets the layout as default for its type', async () => {
    const user = userEvent.setup();

    render(<DatabaseLayoutsMenu databaseId={objectDatabase.id} />);

    // Open the options menu for the first card layout (card-1)
    const buttons = screen.getAllByLabelText(
      'databases.layouts.actions.manage',
    );

    await user.click(buttons[0]);

    // Click "Set as default"
    await user.click(
      screen.getByText('databases.layouts.actions.setAsDefault'),
    );

    // The database's default card layout should now be card-1
    const database = Databases.Store.get(objectDatabase.id)!;

    expect(database.defaultLayouts.card).toBe(layout_card_1.id);
  });

  it('disables "Set as default" when the layout is already the default', async () => {
    const user = userEvent.setup();

    render(<DatabaseLayoutsMenu databaseId={objectDatabase.id} />);

    // layout_card_3 is the default card layout in the fixture.
    // Find its options button (it is the third card layout rendered).
    const buttons = screen.getAllByLabelText(
      'databases.layouts.actions.manage',
    );

    await user.click(buttons[2]);

    // The "Set as default" option should be disabled
    const setAsDefaultItem = screen.getByText(
      'databases.layouts.actions.setAsDefault',
    );

    expect(setAsDefaultItem.closest('[aria-disabled]')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('removes the layout from the database', async () => {
    const user = userEvent.setup();

    render(<DatabaseLayoutsMenu databaseId={objectDatabase.id} />);

    // Open the options menu for the first card layout
    const buttons = screen.getAllByLabelText(
      'databases.layouts.actions.manage',
    );

    await user.click(buttons[0]);

    // Click "Remove"
    await user.click(screen.getByText('databases.layouts.actions.remove'));

    // The layout should no longer be mapped on the database
    const database = Databases.Store.get(objectDatabase.id)!;

    expect(database.layoutPropertyMaps[layout_card_1.id]).toBeUndefined();
  });
});
