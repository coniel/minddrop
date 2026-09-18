import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { render, screen, userEvent, waitFor } from '@minddrop/test-utils';
import { MenuItem } from '@minddrop/ui-primitives';
import { cleanup, setup } from '../test-utils';
import { useEntityGroupSubmenu } from './useEntityGroupSubmenu';

const {
  entityGroup_exclusive_1,
  entityGroup_exclusive_2,
  entityGroup_exclusive_empty,
  groupTypeConfig_exclusive,
  plainItem_1,
} = EntityGroupFixtures;

// An item carrying the group submenu in its menu
const Item: React.FC<{ itemId: string }> = ({ itemId }) => {
  const resolveSubmenu = useEntityGroupSubmenu(groupTypeConfig_exclusive.id);

  return (
    <MenuItem
      stringLabel={itemId}
      menu={[
        {
          type: 'menu-item',
          label: 'entityGroups.labels.group',
          submenu: resolveSubmenu(itemId),
        },
      ]}
    />
  );
};

describe('useEntityGroupSubmenu', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it("lists the type's groups above the option of no group", async () => {
    await openSubmenu(plainItem_1);

    expect(menuEntry('No group')).toBeDefined();
    expect(menuEntry(entityGroup_exclusive_1.name)).toBeDefined();
    expect(menuEntry(entityGroup_exclusive_2.name)).toBeDefined();
    expect(menuEntry(entityGroup_exclusive_empty.name)).toBeDefined();
  });

  it('moves the item to the picked group', async () => {
    await openSubmenu(plainItem_1);
    await userEvent.click(menuEntry(entityGroup_exclusive_2.name));

    await waitFor(() => {
      expect(
        EntityGroups.get(
          groupTypeConfig_exclusive.id,
          entityGroup_exclusive_2.id,
        ).items,
      ).toContain(plainItem_1);
    });

    expect(
      EntityGroups.get(groupTypeConfig_exclusive.id, entityGroup_exclusive_1.id)
        .items,
    ).not.toContain(plainItem_1);
  });

  it('takes the item out of its group when no group is picked', async () => {
    await openSubmenu(plainItem_1);
    await userEvent.click(menuEntry('No group'));

    await waitFor(() => {
      expect(
        EntityGroups.getForItem(groupTypeConfig_exclusive.id, plainItem_1),
      ).toEqual([]);
    });
  });
});

/**
 * Renders the item and opens its group submenu, which a submenu
 * opens to a rest of the pointer rather than to a press.
 */
async function openSubmenu(itemId: string): Promise<void> {
  render(<Item itemId={itemId} />);

  await userEvent.pointer({
    keys: '[MouseRight]',
    target: screen.getByText(itemId),
  });

  await userEvent.hover(await screen.findByText('Group'));

  await waitFor(() => expect(screen.getAllByRole('menu')).toHaveLength(2));
}

/**
 * Returns the submenu entry with the given label.
 */
function menuEntry(label: string): HTMLElement {
  return screen
    .getAllByText(label)
    .find((element) => element.closest('[role="menuitem"]')) as HTMLElement;
}
