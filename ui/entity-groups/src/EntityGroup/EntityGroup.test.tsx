import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { Selection } from '@minddrop/selection';
import {
  act,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '@minddrop/test-utils';
import { EntityGroupList } from '../EntityGroupList';
import { cleanup, dragDataTransfer, setup } from '../test-utils';
import { EntityGroupAddAction } from '../types';

const {
  addressedItem_1,
  addressedItem_2,
  entityGroup_exclusive_1,
  entityGroup_exclusive_2,
  entityGroup_exclusive_empty,
  entityGroup_multi_1,
  entityGroup_multi_2,
  entityGroup_protected,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
  plainItem_1,
  plainItem_2,
} = EntityGroupFixtures;

let dataTransfer = dragDataTransfer();

// Renders an item as its ID, for the tests to find it by
function renderItem(itemId: string) {
  return <span data-testid={itemId}>{itemId}</span>;
}

describe('EntityGroup', () => {
  beforeEach(() => {
    setup();

    // A fresh transfer per test, since a drag carries its own
    dataTransfer = dragDataTransfer();
  });

  afterEach(cleanup);

  function init(type: string) {
    return render(<EntityGroupList type={type} renderItem={renderItem} />);
  }

  // Returns the element of the group with the given name
  function getGroup(name: string): HTMLElement {
    return screen.getByText(name).closest('.entity-group') as HTMLElement;
  }

  // Returns the group's label
  function getLabel(group: HTMLElement): HTMLElement {
    return group.querySelector('.menu-label') as HTMLElement;
  }

  it('lists the items the group holds', () => {
    init(groupTypeConfig_exclusive.id);

    const group = getGroup(entityGroup_exclusive_1.name);

    expect(within(group).getByTestId(addressedItem_1)).toBeInTheDocument();
    expect(within(group).getByTestId(plainItem_1)).toBeInTheDocument();
  });

  it('shows a group listing no items as empty', () => {
    init(groupTypeConfig_exclusive.id);

    expect(
      within(getGroup(entityGroup_exclusive_empty.name)).getByText('Empty'),
    ).toBeInTheDocument();
  });

  // Renders the type's groups with the add action on each
  function initWithAddAction(type: string, action: EntityGroupAddAction) {
    return render(
      <EntityGroupList
        type={type}
        renderItem={renderItem}
        resolveAddAction={() => action}
      />,
    );
  }

  it('highlights the label while its menu is open', async () => {
    init(groupTypeConfig_exclusive.id);

    const group = getGroup(entityGroup_exclusive_1.name);

    await userEvent.click(within(group).getByLabelText('Options'));

    expect(getLabel(group)).toHaveClass('menu-label-active');

    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(getLabel(group)).not.toHaveClass('menu-label-active');
    });
  });

  it('opens its menu as its context menu', async () => {
    init(groupTypeConfig_exclusive.id);

    fireEvent.contextMenu(screen.getByText(entityGroup_exclusive_1.name));

    expect(await screen.findByText('Rename group')).toBeInTheDocument();
  });

  it('fires the add action when the add button is clicked', async () => {
    let clicked = false;

    initWithAddAction(groupTypeConfig_exclusive.id, {
      onClick: () => {
        clicked = true;
      },
    });

    const group = getGroup(entityGroup_exclusive_1.name);

    await userEvent.click(within(group).getByLabelText('New'));

    expect(clicked).toBe(true);
  });

  it('opens the add popover from the add button', async () => {
    initWithAddAction(groupTypeConfig_exclusive.id, {
      popover: ({ open }) => (open ? <div>Add form</div> : null),
    });

    const group = getGroup(entityGroup_exclusive_1.name);

    await userEvent.click(within(group).getByLabelText('New'));

    expect(screen.getByText('Add form')).toBeInTheDocument();
  });

  it('holds the label highlighted while the add popover is open', async () => {
    initWithAddAction(groupTypeConfig_exclusive.id, {
      // A popover which takes no hold of its own, so the hold under
      // test is the group's.
      popover: ({ open }) => (open ? <div>picker</div> : null),
    });

    const group = getGroup(entityGroup_exclusive_1.name);

    await userEvent.click(within(group).getByLabelText('New'));

    // The button the popover is anchored to is hover revealed, so
    // it would fade out from under it.
    await waitFor(() => {
      expect(getLabel(group)).toHaveClass('menu-label-active');
    });
  });

  it('offers the rename and delete actions', async () => {
    init(groupTypeConfig_exclusive.id);

    const group = getGroup(entityGroup_exclusive_1.name);

    fireEvent.click(within(group).getByLabelText('Options'));

    expect(await screen.findByText('Rename group')).toBeInTheDocument();
    expect(await screen.findByText('Delete group')).toBeInTheDocument();
  });

  it('offers no actions on a group the app provides', () => {
    init(groupTypeConfig_multi.id);

    const group = getGroup(entityGroup_protected.name);

    expect(within(group).queryByLabelText('Options')).toBeNull();
  });

  // Covers the routing from a drop to the model call it stands for.
  // The gesture in between the drag start and the drop is not one
  // the environment can express, and is left to end-to-end tests.
  it('moves a dropped item into the group', () => {
    init(groupTypeConfig_exclusive.id);

    fireEvent.dragStart(screen.getByTestId(addressedItem_2), { dataTransfer });
    fireEvent.drop(getGroup(entityGroup_exclusive_1.name), { dataTransfer });

    expect(
      EntityGroups.get(groupTypeConfig_exclusive.id, entityGroup_exclusive_1.id)
        .items,
    ).toEqual([addressedItem_1, plainItem_1, addressedItem_2]);
    expect(
      EntityGroups.get(groupTypeConfig_exclusive.id, entityGroup_exclusive_2.id)
        .items,
    ).toEqual([]);
  });

  it('offers no drop target on a group the app provides', () => {
    init(groupTypeConfig_multi.id);

    const group = getGroup(entityGroup_protected.name);

    fireEvent.dragStart(
      within(getGroup(entityGroup_multi_1.name)).getByTestId(plainItem_1),
      { dataTransfer },
    );
    fireEvent.dragOver(group, { dataTransfer });

    expect(getLabel(group)).not.toHaveClass('menu-label-highlighted');

    fireEvent.drop(group, { dataTransfer });

    expect(
      EntityGroups.get(groupTypeConfig_multi.id, entityGroup_protected.id)
        .items,
    ).toEqual([]);
  });

  it('highlights the label while items are dragged over it', () => {
    init(groupTypeConfig_exclusive.id);

    const group = getGroup(entityGroup_exclusive_1.name);

    fireEvent.dragStart(screen.getByTestId(addressedItem_2), { dataTransfer });
    fireEvent.dragOver(group, { dataTransfer });

    expect(getLabel(group)).toHaveClass('menu-label-highlighted');
  });

  // An item takes the drags over it for itself unless told not to,
  // and the group would then never hear of them.
  it('highlights the label while items are dragged over one of its items', () => {
    init(groupTypeConfig_exclusive.id);

    const group = getGroup(entityGroup_exclusive_1.name);

    fireEvent.dragStart(screen.getByTestId(addressedItem_2), { dataTransfer });
    fireEvent.dragOver(within(group).getByTestId(plainItem_1), {
      dataTransfer,
    });

    expect(getLabel(group)).toHaveClass('menu-label-highlighted');
  });

  // The item takes the drop for itself, so the group hears nothing
  // of it unless it listens for the drop on its way down.
  it('stops highlighting the label once the items are dropped on one of its items', () => {
    init(groupTypeConfig_exclusive.id);

    const group = getGroup(entityGroup_exclusive_1.name);

    fireEvent.dragStart(screen.getByTestId(addressedItem_2), { dataTransfer });
    fireEvent.dragOver(group, { dataTransfer });
    fireEvent.drop(within(group).getByTestId(plainItem_1), { dataTransfer });

    expect(getLabel(group)).not.toHaveClass('menu-label-highlighted');
  });

  it('drops the item from the group it was dragged out of', () => {
    init(groupTypeConfig_multi.id);

    // A type whose items can belong to several groups, so an item
    // which stayed behind would be one the drop copied rather than
    // moved.
    fireEvent.dragStart(
      within(getGroup(entityGroup_multi_1.name)).getByTestId(plainItem_1),
      { dataTransfer },
    );
    fireEvent.drop(getGroup(entityGroup_multi_2.name), { dataTransfer });

    expect(
      EntityGroups.get(groupTypeConfig_multi.id, entityGroup_multi_2.id).items,
    ).toEqual([addressedItem_1, plainItem_1]);
    expect(
      EntityGroups.get(groupTypeConfig_multi.id, entityGroup_multi_1.id).items,
    ).toEqual([addressedItem_1]);
  });

  describe('items from outside the type', () => {
    // Renders both types of groups, so that an item can be dragged
    // out of one type's group into the other's.
    function initBoth() {
      return render(
        <>
          <EntityGroupList
            type={groupTypeConfig_exclusive.id}
            renderItem={renderItem}
          />
          <EntityGroupList
            type={groupTypeConfig_multi.id}
            renderItem={renderItem}
          />
        </>,
      );
    }

    it('adds an item dragged out of another type of group when the type takes items from outside', () => {
      initBoth();

      fireEvent.dragStart(
        within(getGroup(entityGroup_exclusive_2.name)).getByTestId(
          addressedItem_2,
        ),
        { dataTransfer },
      );
      fireEvent.drop(getGroup(entityGroup_multi_2.name), { dataTransfer });

      // Added rather than moved, the other type's group being none
      // of this type's business.
      expect(
        EntityGroups.get(groupTypeConfig_multi.id, entityGroup_multi_2.id)
          .items,
      ).toEqual([addressedItem_1, addressedItem_2]);
      expect(
        EntityGroups.get(
          groupTypeConfig_exclusive.id,
          entityGroup_exclusive_2.id,
        ).items,
      ).toEqual([addressedItem_2]);
    });

    it('ignores an item dragged out of another type of group when the type does not', () => {
      initBoth();

      const group = getGroup(entityGroup_exclusive_empty.name);

      fireEvent.dragStart(
        within(getGroup(entityGroup_multi_1.name)).getByTestId(plainItem_1),
        { dataTransfer },
      );
      fireEvent.dragOver(group, { dataTransfer });
      fireEvent.drop(group, { dataTransfer });

      expect(
        EntityGroups.get(
          groupTypeConfig_exclusive.id,
          entityGroup_exclusive_empty.id,
        ).items,
      ).toEqual([]);
    });

    it('ignores an item dragged in from no group when the type does not', () => {
      init(groupTypeConfig_exclusive.id);

      const group = getGroup(entityGroup_exclusive_empty.name);

      act(() => {
        Selection.select([{ id: plainItem_2, type: 'plain-item', data: {} }]);
        Selection.Store.getState().setIsDragging(true);
      });

      fireEvent.dragOver(group, { dataTransfer });
      fireEvent.drop(group, { dataTransfer });

      expect(
        EntityGroups.get(
          groupTypeConfig_exclusive.id,
          entityGroup_exclusive_empty.id,
        ).items,
      ).toEqual([]);
    });
  });

  // The actions are revealed by CSS, which the environment does not
  // apply, so the test pins the class the stylesheet keys off.
  it('keeps a user group actions on its own label', () => {
    init(groupTypeConfig_exclusive.id);

    const group = getGroup(entityGroup_exclusive_1.name);

    expect(group.querySelector('.menu-group')).not.toHaveClass(
      'menu-group-show-label-actions-on-hover',
    );
  });

  it('reveals an app provided group actions to a hover anywhere in it', () => {
    init(groupTypeConfig_multi.id);

    const group = getGroup(entityGroup_protected.name);

    expect(group.querySelector('.menu-group')).toHaveClass(
      'menu-group-show-label-actions-on-hover',
    );
  });

  describe('collapsing', () => {
    // Which groups are collapsed is kept for the workspace, so that
    // the sidebar opens as the user left it.
    it('remembers that the group was collapsed', () => {
      init(groupTypeConfig_exclusive.id);

      fireEvent.click(screen.getByText(entityGroup_exclusive_1.name));

      expect(
        EntityGroups.CollapsedStore.get(
          `${groupTypeConfig_exclusive.id}:${entityGroup_exclusive_1.id}`,
        ),
      ).toBe(true);
    });

    it('remembers that the group was expanded again', () => {
      init(groupTypeConfig_exclusive.id);

      fireEvent.click(screen.getByText(entityGroup_exclusive_1.name));
      fireEvent.click(screen.getByText(entityGroup_exclusive_1.name));

      expect(
        EntityGroups.CollapsedStore.get(
          `${groupTypeConfig_exclusive.id}:${entityGroup_exclusive_1.id}`,
        ),
      ).toBe(false);
    });

    it('renders a collapsed group collapsed', () => {
      EntityGroups.setCollapsed(
        groupTypeConfig_exclusive.id,
        entityGroup_exclusive_1.id,
        true,
      );

      init(groupTypeConfig_exclusive.id);

      const group = getGroup(entityGroup_exclusive_1.name);

      expect(within(group).queryByTestId(plainItem_1)).toBeNull();
    });

    it('renders a group the user has not collapsed expanded', () => {
      init(groupTypeConfig_exclusive.id);

      const group = getGroup(entityGroup_exclusive_1.name);

      expect(within(group).getByTestId(plainItem_1)).toBeInTheDocument();
    });
  });
});
