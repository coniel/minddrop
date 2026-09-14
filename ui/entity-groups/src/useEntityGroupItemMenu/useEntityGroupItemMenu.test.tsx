import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import {
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { MenuItem } from '@minddrop/ui-primitives';
import { EntityGroupList } from '../EntityGroupList';
import { cleanup, setup } from '../test-utils';
import { useEntityGroupItemMenu } from './useEntityGroupItemMenu';

const {
  addressedItem_1,
  entityGroup_exclusive_1,
  entityGroup_exclusive_empty,
  entityGroup_multi_1,
  entityGroup_multi_2,
  entityGroup_protected,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
  plainItem_1,
} = EntityGroupFixtures;

// An item carrying the group actions in its menu
const Item: React.FC<{ itemId: string }> = ({ itemId }) => {
  const { menu, popovers } = useEntityGroupItemMenu();

  return <MenuItem stringLabel={itemId} menu={menu} popovers={popovers} />;
};

describe('useEntityGroupItemMenu', () => {
  beforeEach(setup);

  afterEach(cleanup);

  function init(type: string) {
    render(
      <EntityGroupList
        type={type}
        renderItem={(itemId) => <Item itemId={itemId} />}
      />,
    );
  }

  it('takes the item out of the group listing it', async () => {
    init(groupTypeConfig_exclusive.id);

    await openItemMenu(plainItem_1);
    await userEvent.click(await screen.findByText('Remove from group'));

    expect(
      EntityGroups.get(groupTypeConfig_exclusive.id, entityGroup_exclusive_1.id)
        .items,
    ).not.toContain(plainItem_1);
  });

  it('moves the item to the chosen group', async () => {
    init(groupTypeConfig_exclusive.id);

    await openItemMenu(plainItem_1);
    await openSubmenu('Move to group');
    await pickGroup(entityGroup_exclusive_empty.name);

    expect(
      EntityGroups.get(
        groupTypeConfig_exclusive.id,
        entityGroup_exclusive_empty.id,
      ).items,
    ).toContain(plainItem_1);
    expect(
      EntityGroups.get(groupTypeConfig_exclusive.id, entityGroup_exclusive_1.id)
        .items,
    ).not.toContain(plainItem_1);
  });

  it('adds the item to the chosen group, leaving it where it is', async () => {
    init(groupTypeConfig_multi.id);

    await openItemMenu(plainItem_1);
    await openSubmenu('Add to group');
    await pickGroup(entityGroup_multi_2.name);

    expect(
      EntityGroups.get(groupTypeConfig_multi.id, entityGroup_multi_2.id).items,
    ).toContain(plainItem_1);
    expect(
      EntityGroups.get(groupTypeConfig_multi.id, entityGroup_multi_1.id).items,
    ).toContain(plainItem_1);
  });

  it('offers no adding for a type whose items belong to one group', async () => {
    init(groupTypeConfig_exclusive.id);

    await openItemMenu(plainItem_1);

    await screen.findByText('Move to group');

    expect(screen.queryByText('Add to group')).toBeNull();
  });

  it('leaves out the groups already holding the item', async () => {
    init(groupTypeConfig_multi.id);

    // Listed in both of the user's groups, so the menu opened from
    // the first has nowhere left to offer but a new group.
    await openItemMenu(addressedItem_1);
    await openSubmenu('Add to group');

    expect(menuEntry(entityGroup_multi_1.name)).toBeUndefined();
    expect(menuEntry(entityGroup_multi_2.name)).toBeUndefined();
  });

  it("leaves out the app's own groups", async () => {
    init(groupTypeConfig_multi.id);

    await openItemMenu(plainItem_1);
    await openSubmenu('Add to group');

    expect(menuEntry(entityGroup_multi_2.name)).toBeDefined();
    expect(menuEntry(entityGroup_protected.name)).toBeUndefined();
  });

  it('makes a group and moves the item into it', async () => {
    init(groupTypeConfig_exclusive.id);

    await openItemMenu(plainItem_1);
    await openSubmenu('Move to group');
    await pickNewGroup('A moved group');

    await waitFor(() => {
      expect(EntityGroups.getAll(groupTypeConfig_exclusive.id)[0].name).toBe(
        'A moved group',
      );
    });

    expect(EntityGroups.getAll(groupTypeConfig_exclusive.id)[0].items).toEqual([
      plainItem_1,
    ]);
    expect(
      EntityGroups.get(groupTypeConfig_exclusive.id, entityGroup_exclusive_1.id)
        .items,
    ).not.toContain(plainItem_1);
  });

  it('makes a group and adds the item to it', async () => {
    init(groupTypeConfig_multi.id);

    await openItemMenu(plainItem_1);
    await openSubmenu('Add to group');
    await pickNewGroup('An added group');

    await waitFor(() => {
      expect(EntityGroups.getAll(groupTypeConfig_multi.id)[0].name).toBe(
        'An added group',
      );
    });

    expect(EntityGroups.getAll(groupTypeConfig_multi.id)[0].items).toEqual([
      plainItem_1,
    ]);
    expect(
      EntityGroups.get(groupTypeConfig_multi.id, entityGroup_multi_1.id).items,
    ).toContain(plainItem_1);
  });
});

/**
 * Opens the context menu of the item with the given ID, which the
 * items are labelled with.
 */
async function openItemMenu(itemId: string): Promise<void> {
  await userEvent.pointer({
    keys: '[MouseRight]',
    target: screen.getAllByText(itemId)[0],
  });
}

/**
 * Opens the submenu of the menu action with the given label, which
 * a submenu opens to a rest of the pointer rather than to a press.
 */
async function openSubmenu(label: string): Promise<void> {
  await userEvent.hover(await screen.findByText(label));

  await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(2));
}

/**
 * Picks the group with the given name from the open submenu.
 */
async function pickGroup(name: string): Promise<void> {
  await userEvent.click(menuEntry(name) as HTMLElement);
}

/**
 * Makes a group from the open submenu, naming it in the popover
 * the action opens.
 */
async function pickNewGroup(name: string): Promise<void> {
  await userEvent.click(await screen.findByText('New group'));

  const nameField = await screen.findByPlaceholderText('Group name');

  fireEvent.change(nameField, { target: { value: name } });
  fireEvent.keyDown(nameField, { key: 'Enter' });
}

/**
 * Returns the menu entry for the group with the given name, or
 * undefined when the menu does not offer it. The list shows the
 * group under the same name, so the entry is the one which is a
 * menu item.
 */
function menuEntry(name: string): HTMLElement | undefined {
  return screen
    .queryAllByText(name)
    .find((element) => element.closest('[role="menuitem"]'));
}
