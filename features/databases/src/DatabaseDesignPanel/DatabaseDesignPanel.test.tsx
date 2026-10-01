import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Databases } from '@minddrop/databases';
import { DatabaseFixtures } from '@minddrop/databases/test-utils';
import { Designs } from '@minddrop/designs-next';
import { DesignFixtures } from '@minddrop/designs-next/test-utils';
import { Events } from '@minddrop/events';
import { render, screen, userEvent, within } from '@minddrop/test-utils';
import { Views } from '@minddrop/views';
import { WorkspaceFixtures } from '@minddrop/workspaces/test-utils';
import { cleanup, setup } from '../test-utils';
import { DatabaseDesignPanel } from './DatabaseDesignPanel';

const { objectDatabase } = DatabaseFixtures;
const { ownedCardDesign_1, ownedCardDesign_2, ownedListDesign_1 } =
  DesignFixtures;
const { workspace_1 } = WorkspaceFixtures;

// The object database's two card designs and its list design
const cardDesign = { ...ownedCardDesign_1, owner: objectDatabase.id };
const secondCardDesign = { ...ownedCardDesign_2, owner: objectDatabase.id };
const listDesign = { ...ownedListDesign_1, owner: objectDatabase.id };

/**
 * Renders the panel on the object database inside a subview context.
 *
 * @returns The render container.
 */
function renderPanel() {
  const { container } = render(
    <Views.SubviewProvider subview={null}>
      <DatabaseDesignPanel databaseId={objectDatabase.id} />
    </Views.SubviewProvider>,
  );

  return container;
}

/**
 * Returns the default design row of the given context.
 *
 * @param context - The context's name.
 * @returns The row element.
 */
function contextRow(context: string): HTMLElement {
  return screen
    .getByText(context)
    .closest('.database-design-panel-row') as HTMLElement;
}

describe('<DatabaseDesignPanel />', () => {
  beforeEach(() => {
    setup();

    Designs.load([cardDesign, secondCardDesign, listDesign], workspace_1.id);
  });

  afterEach(cleanup);

  it("offers the database's designs of each context's base type", async () => {
    const user = userEvent.setup();

    renderPanel();

    await user.click(within(contextRow('Card')).getByRole('combobox'));

    expect(
      screen.getByRole('option', { name: cardDesign.name }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: secondCardDesign.name }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: listDesign.name })).toBeNull();
  });

  it('shows the pinned design, else the first of the base type', async () => {
    await Databases.setDefaultDesign(
      objectDatabase.id,
      'card',
      secondCardDesign.id,
    );

    renderPanel();

    expect(within(contextRow('Card')).getByRole('combobox')).toHaveTextContent(
      secondCardDesign.name,
    );
    expect(within(contextRow('List')).getByRole('combobox')).toHaveTextContent(
      listDesign.name,
    );
  });

  it("pins the picked design as the context's default", async () => {
    const user = userEvent.setup();

    renderPanel();

    await user.click(within(contextRow('Card')).getByRole('combobox'));
    await user.click(
      screen.getByRole('option', { name: secondCardDesign.name }),
    );

    expect(Databases.get(objectDatabase.id).defaultDesigns?.card).toBe(
      secondCardDesign.id,
    );
  });

  it('notes a context the database has no design for', () => {
    renderPanel();

    expect(
      within(contextRow('Page')).getByText('No compatible designs'),
    ).toBeInTheDocument();
  });

  it('prompts to create a design while the database has none', () => {
    Designs.Store.clear();

    renderPanel();

    expect(screen.getByText('databases.design.noDesigns')).toBeInTheDocument();
    expect(screen.queryByText('Card')).toBeNull();
  });

  it('enters design mode', async () =>
    new Promise<void>((done) => {
      const user = userEvent.setup();

      Events.addListener(Views.events.SetSubview, 'test', (data) => {
        expect(data.subview?.id).toBe('designs');
        done();
      });

      renderPanel();

      user.click(screen.getByLabelText('databases.design.actions.designMode'));
    }));
});
