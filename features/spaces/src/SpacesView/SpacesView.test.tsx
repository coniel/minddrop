import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SpaceGroups } from '@minddrop/spaces';
import {
  SpaceFixtures,
  SpaceGroupFixtures,
  cleanupSpaceFixtures,
  setupSpaceFixtures,
} from '@minddrop/spaces/test-utils';
import {
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '@minddrop/test-utils';
import { Views } from '@minddrop/views';
import { NewSpaceDialog } from '../NewSpaceDialog';
import { MockFs, cleanup, setup } from '../test-utils';
import { SpacesView } from './SpacesView';

const { space_1, space_2 } = SpaceFixtures;
const { spaceGroup_1, spaceGroup_2 } = SpaceGroupFixtures;

// Renders the view inside a subview context, with the dialog its
// creation actions open.
function renderView() {
  return render(
    <Views.SubviewProvider subview={null}>
      <SpacesView />
      <NewSpaceDialog />
    </Views.SubviewProvider>,
  );
}

// Returns the element of the group with the given name
function getGroup(name: string): HTMLElement {
  return screen.getByText(name).closest('.entity-group') as HTMLElement;
}

describe('<SpacesView />', () => {
  beforeEach(() => {
    setup();

    // Load the spaces and their groups
    setupSpaceFixtures(MockFs);
  });

  afterEach(async () => {
    cleanupSpaceFixtures();
    await cleanup();
  });

  it('lists the spaces under the groups holding them', async () => {
    await SpaceGroups.addItem(spaceGroup_1.id, space_1.id);

    renderView();

    expect(
      within(getGroup(spaceGroup_1.name)).getByText(space_1.name),
    ).toBeInTheDocument();
    expect(
      within(getGroup('Ungrouped')).getByText(space_2.name),
    ).toBeInTheDocument();
  });

  it("creates a space in a group from the group's add button", async () => {
    const user = userEvent.setup();

    renderView();

    // Open the new space dialog from the group's add button
    await user.click(
      within(getGroup(spaceGroup_2.name)).getByLabelText('spaces.actions.new'),
    );

    // Name the space and create it
    await user.type(
      await screen.findByPlaceholderText('spaces.form.name.placeholder'),
      'Reading',
    );
    await user.click(screen.getByText('spaces.form.actions.create'));

    // The space should be filed under the group it was created from
    await waitFor(() => {
      expect(SpaceGroups.get(spaceGroup_2.id).items).toHaveLength(1);
    });
  });

  it('lists the matches without their groups while searching', async () => {
    const user = userEvent.setup();

    await SpaceGroups.addItem(spaceGroup_1.id, space_1.id);

    renderView();

    await user.type(
      screen.getByPlaceholderText('spaces.list.searchPlaceholder'),
      space_1.name,
    );

    await waitFor(() => {
      expect(screen.queryByText(spaceGroup_1.name)).toBeNull();
    });

    expect(screen.queryByText('Ungrouped')).toBeNull();
    expect(getListedNames()).toEqual([space_1.name]);
  });
});

/**
 * Returns the names of every space listed in the left column, in
 * the order they are shown.
 */
function getListedNames(): (string | null)[] {
  const list = document.querySelector(
    '.list-panel-view-list-items',
  ) as HTMLElement;

  return Array.from(list.querySelectorAll('.menu-item-label')).map(
    (label) => label.textContent,
  );
}
