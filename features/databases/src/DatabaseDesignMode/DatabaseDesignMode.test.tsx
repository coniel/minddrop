import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { Events } from '@minddrop/events';
import { i18n } from '@minddrop/i18n';
import {
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { Views } from '@minddrop/views';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { cleanup, setup } from '../test-utils';
import { DatabaseDesignMode } from './DatabaseDesignMode';

const { objectDatabase } = DatabaseFixtures;
const { ownedCardDesign_1, ownedListDesign_1 } = DesignFixtures;

// The database's designs, listed in the config with the list
// design first.
const cardDesign = { ...ownedCardDesign_1, owner: objectDatabase.id };
const listDesign = { ...ownedListDesign_1, owner: objectDatabase.id };
const database = {
  ...objectDatabase,
  designs: [listDesign.id, cardDesign.id],
};

/**
 * Renders design mode on the fixture database.
 *
 * @returns The render container.
 */
function renderDesignMode() {
  const { container } = render(<DatabaseDesignMode databaseId={database.id} />);

  return container;
}

/**
 * Returns the rendered design tabs.
 *
 * @param container - The render container.
 * @returns The tab elements.
 */
function getTabs(container: HTMLElement) {
  return Array.from(container.querySelectorAll('.tabs-tab'));
}

const { workspace_1 } = WorkspaceFixtures;

describe('<DatabaseDesignMode />', () => {
  beforeEach(() => {
    setup();

    Databases.Store.set(database);
    Designs.load([cardDesign, listDesign], workspace_1.id);
  });

  afterEach(cleanup);

  it('labels the tab with the active design without navigating', () =>
    new Promise<void>((done) => {
      Events.addListener(Views.events.SetSubview, 'test-label', (data) => {
        expect(data.subview?.label).toBe(listDesign.name);
        expect(data.replace).toBe(true);
        done();
      });

      render(
        <Views.SubviewProvider subview={{ id: 'designs', title: 'Designs' }}>
          <DatabaseDesignMode databaseId={database.id} />
        </Views.SubviewProvider>,
      );
    }));

  it('renders the database designs as tabs in config order', () => {
    const container = renderDesignMode();

    expect(getTabs(container).map((tab) => tab.textContent)).toEqual([
      listDesign.name,
      cardDesign.name,
    ]);
  });

  it('renders the design editor on the active design', () => {
    const container = renderDesignMode();

    expect(container.querySelector('.design-editor')).not.toBeNull();
  });

  it('renders an empty message when the database has no designs', () => {
    Designs.Store.clear();

    const container = renderDesignMode();

    expect(container.querySelector('.design-editor')).toBeNull();
    screen.getByText('databases.design.empty');
  });

  it('creates a design of the selected type from the add menu', async () => {
    const user = userEvent.setup();

    renderDesignMode();

    await user.click(screen.getByLabelText('databases.design.actions.add'));
    await user.click(screen.getByText('designsNext.types.page'));

    await waitFor(() => {
      const pageDesign = Designs.getByOwner(database.id).find(
        (design) => design.type === 'page',
      );

      expect(pageDesign).toBeDefined();
    });
  });

  it('opens the new design menu with an empty name field', async () => {
    const user = userEvent.setup();

    renderDesignMode();

    await user.click(screen.getByLabelText('databases.design.actions.add'));
    await user.click(screen.getByText('designsNext.types.page'));

    // The type name is the placeholder of the empty field
    const input = await waitFor(() =>
      screen.getByPlaceholderText('designsNext.types.page'),
    );

    expect(input).toHaveValue('');
  });

  it('names a design after its type when its name is cleared', async () => {
    const container = renderDesignMode();

    fireEvent.contextMenu(getTabs(container)[1]);

    const input = await waitFor(() =>
      screen.getByDisplayValue(cardDesign.name),
    );

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(Designs.get(cardDesign.id).name).toBe(
      i18n.t('designsNext.types.card'),
    );
  });

  it('closes the menu when the name is submitted', async () => {
    const container = renderDesignMode();

    fireEvent.contextMenu(getTabs(container)[1]);

    const input = await waitFor(() =>
      screen.getByDisplayValue(cardDesign.name),
    );

    fireEvent.change(input, { target: { value: 'Renamed' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(screen.queryByDisplayValue('Renamed')).toBeNull();
    });
  });

  it("opens the active design's menu from the settings button", async () => {
    const user = userEvent.setup();

    renderDesignMode();

    await user.click(
      screen.getByLabelText('databases.design.actions.settings'),
    );

    // The list design is active, being first in the config order
    await waitFor(() => screen.getByDisplayValue(listDesign.name));
  });

  it('renames a design from its tab menu', async () => {
    const container = renderDesignMode();

    // Open the card tab's menu
    fireEvent.contextMenu(getTabs(container)[1]);

    const input = await waitFor(() =>
      screen.getByDisplayValue(cardDesign.name),
    );

    fireEvent.change(input, { target: { value: 'Renamed' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(Designs.get(cardDesign.id).name).toBe('Renamed');
  });

  it('duplicates a design from its tab menu', async () => {
    const user = userEvent.setup();
    const container = renderDesignMode();

    fireEvent.contextMenu(getTabs(container)[1]);
    await user.click(
      await waitFor(() =>
        screen.getByText('databases.design.actions.duplicate'),
      ),
    );

    await waitFor(() => {
      expect(Designs.getByOwner(database.id)).toHaveLength(3);
    });
  });

  it('deletes a design from its tab menu after confirmation', async () => {
    const user = userEvent.setup();
    const container = renderDesignMode();

    // Confirm the deletion when the dialog is requested
    Events.addListener(
      Events.events.OpenConfirmationDialog,
      'test-confirm',
      (data) => data.onConfirm(),
    );

    fireEvent.contextMenu(getTabs(container)[1]);
    await user.click(
      await waitFor(() => screen.getByText('databases.design.actions.delete')),
    );

    await waitFor(() => {
      expect(Designs.get(cardDesign.id, false)).toBeNull();
    });
  });

  it('toggles the contexts a design is used for', async () => {
    const user = userEvent.setup();
    const container = renderDesignMode();

    fireEvent.contextMenu(getTabs(container)[1]);
    await user.click(
      await waitFor(() =>
        screen.getByText('databases.design.actions.useAsDefault'),
      ),
    );
    // Toggle the preview card context on. Mouse clicks do not reach
    // submenu items in the test environment, the keyboard does.
    const item = await waitFor(() =>
      screen.getByText('databases.layoutContexts.preview-card.name'),
    );

    fireEvent.keyDown(item.closest('[role="menuitemcheckbox"]')!, {
      key: 'Enter',
    });

    await waitFor(() => {
      expect(Databases.get(database.id).defaultDesigns).toEqual({
        'preview-card': cardDesign.id,
      });
    });
  });
});
