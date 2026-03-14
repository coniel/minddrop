import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DatabaseFixtures, Databases } from '@minddrop/databases';
import { DesignFixtures, Designs } from '@minddrop/designs';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { setup as baseSetup, cleanup } from '../test-utils';
import { DatabaseDesignsMenu } from './DatabaseDesignsMenu';

const { objectDatabase } = DatabaseFixtures;
const { design_card_1, design_card_2, design_list_1 } = DesignFixtures;

function setup() {
  baseSetup();

  // Load designs into the store
  Designs.Store.load(DesignFixtures.designs);
}

describe('<DatabaseDesignsMenu />', () => {
  beforeEach(setup);

  afterEach(() => {
    cleanup();
    Designs.Store.clear();
  });

  it('renders mapped designs grouped by type', () => {
    render(<DatabaseDesignsMenu databaseId={objectDatabase.id} />);

    // Should render mapped designs
    screen.getByText(design_card_1.name);
    screen.getByText(design_card_2.name);
    screen.getByText(design_list_1.name);
  });

  it('sets the design as default for its type', async () => {
    const user = userEvent.setup();

    render(<DatabaseDesignsMenu databaseId={objectDatabase.id} />);

    // Open the options menu for the first card design (card-1)
    const buttons = screen.getAllByLabelText(
      'databases.designs.actions.manage',
    );

    await user.click(buttons[0]);

    // Click "Set as default"
    await user.click(
      screen.getByText('databases.designs.actions.setAsDefault'),
    );

    // The database's default card design should now be card-1
    const database = Databases.Store.get(objectDatabase.id)!;

    expect(database.defaultDesigns.card).toBe(design_card_1.id);
  });

  it('disables "Set as default" when the design is already the default', async () => {
    const user = userEvent.setup();

    render(<DatabaseDesignsMenu databaseId={objectDatabase.id} />);

    // design_card_2 is the default card design in the fixture.
    // Find its options button (it is the second card design rendered).
    const buttons = screen.getAllByLabelText(
      'databases.designs.actions.manage',
    );

    await user.click(buttons[1]);

    // The "Set as default" option should be disabled
    const setAsDefaultItem = screen.getByText(
      'databases.designs.actions.setAsDefault',
    );

    expect(setAsDefaultItem.closest('[aria-disabled]')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('removes the design from the database', async () => {
    const user = userEvent.setup();

    render(<DatabaseDesignsMenu databaseId={objectDatabase.id} />);

    // Open the options menu for the first card design
    const buttons = screen.getAllByLabelText(
      'databases.designs.actions.manage',
    );

    await user.click(buttons[0]);

    // Click "Remove"
    await user.click(screen.getByText('databases.designs.actions.remove'));

    // The design should no longer be mapped on the database
    const database = Databases.Store.get(objectDatabase.id)!;

    expect(database.designPropertyMaps[design_card_1.id]).toBeUndefined();
  });
});
