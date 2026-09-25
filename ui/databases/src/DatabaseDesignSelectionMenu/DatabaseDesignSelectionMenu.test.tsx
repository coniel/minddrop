import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Design, DesignType, Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { render, screen, userEvent } from '@minddrop/test-utils';
import { Button, DropdownMenu } from '@minddrop/ui-primitives';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { cleanup, setup } from '../test-utils';
import {
  DatabaseDesignSelectionMenu,
  DatabaseDesignSelectionMenuProps,
} from './DatabaseDesignSelectionMenu';

const { objectDatabase } = DatabaseFixtures;
const { ownedCardDesign_1, ownedListDesign_1 } = DesignFixtures;
const { workspace_1 } = WorkspaceFixtures;

// The database's designs: two card designs and a list design,
// listed by the database in the reverse of their store order.
const cardDesign = {
  ...ownedCardDesign_1,
  name: 'Wide card',
  owner: objectDatabase.id,
};
const secondCardDesign: Design = {
  ...ownedCardDesign_1,
  id: 'design_card-2',
  name: 'Tall card',
  owner: objectDatabase.id,
};
const listDesign = {
  ...ownedListDesign_1,
  name: 'Compact row',
  owner: objectDatabase.id,
};

// The design ID reported by the most recent selection
let selectedDesignId: string | null;

/**
 * Renders the menu open on the object database, recording the
 * design it reports.
 *
 * @param designType - The design type to list.
 * @param value - The selected design ID, or the selected design IDs keyed by database ID.
 */
async function renderMenu(
  designType: DesignType,
  value?: DatabaseDesignSelectionMenuProps['value'],
) {
  selectedDesignId = null;

  render(
    <DropdownMenu trigger={<Button label="test" />}>
      <DatabaseDesignSelectionMenu
        databaseId={objectDatabase.id}
        designType={designType}
        value={value}
        onValueChange={(designId) => {
          selectedDesignId = designId;
        }}
      />
    </DropdownMenu>,
  );

  await userEvent.click(screen.getByRole('button'));
}

describe('<DatabaseDesignSelectionMenu />', () => {
  beforeEach(() => {
    setup();

    // The database lists its designs in its own order
    Databases.Store.update(objectDatabase.id, {
      designs: [secondCardDesign.id, cardDesign.id, listDesign.id],
    });

    Designs.load([cardDesign, secondCardDesign, listDesign], workspace_1.id);
  });

  afterEach(cleanup);

  it("lists the database's designs of the requested type", async () => {
    await renderMenu('card');

    screen.getByText(cardDesign.name);
    screen.getByText(secondCardDesign.name);
    expect(screen.queryByText(listDesign.name)).toBeNull();
  });

  it('lists the designs in the order the database holds them', async () => {
    await renderMenu('card');

    const items = screen.getAllByRole('menuitem');

    // The database default leads, then the designs in the database's
    // own order rather than the store's.
    expect(items.map((item) => item.textContent)).toEqual([
      'Database default',
      secondCardDesign.name,
      cardDesign.name,
    ]);
  });

  it("marks the database's design from a record value as selected", async () => {
    await renderMenu('card', { [objectDatabase.id]: secondCardDesign.id });

    expect(
      screen.getByRole('menuitem', { name: secondCardDesign.name }),
    ).toHaveAttribute('data-checked');
    expect(
      screen.getByRole('menuitem', { name: cardDesign.name }),
    ).not.toHaveAttribute('data-checked');
  });

  it('reports the design picked', async () => {
    await renderMenu('card');

    await userEvent.click(screen.getByText(secondCardDesign.name));

    expect(selectedDesignId).toBe(secondCardDesign.id);
  });

  it('reports the default rather than a design ID', async () => {
    await renderMenu('card', secondCardDesign.id);

    await userEvent.click(screen.getByText('Database default'));

    expect(selectedDesignId).toBe(Databases.constants.DefaultDesignId);
  });

  it('renders nothing for a database owning no design of the type', async () => {
    Designs.Store.remove(listDesign.id);

    await renderMenu('list');

    expect(screen.queryByRole('menuitem')).toBeNull();
  });
});
