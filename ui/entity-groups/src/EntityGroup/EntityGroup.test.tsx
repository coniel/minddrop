import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { fireEvent, render, screen, within } from '@minddrop/test-utils';
import { EntityGroupList } from '../EntityGroupList';
import { cleanup, dragDataTransfer, setup } from '../test-utils';

const {
  addressedItem_1,
  addressedItem_2,
  entityGroup_exclusive_1,
  entityGroup_exclusive_2,
  entityGroup_multi_1,
  entityGroup_multi_2,
  entityGroup_protected,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
  plainItem_1,
} = EntityGroupFixtures;

let dataTransfer = dragDataTransfer();

describe('EntityGroup', () => {
  beforeEach(() => {
    setup();

    // A fresh transfer per test, since a drag carries its own
    dataTransfer = dragDataTransfer();
  });

  afterEach(cleanup);

  function init(type: string) {
    return render(
      <EntityGroupList
        type={type}
        renderItem={(itemId) => <span data-testid={itemId}>{itemId}</span>}
      />,
    );
  }

  // Returns the element of the group with the given name
  function getGroup(name: string): HTMLElement {
    return screen.getByText(name).closest('.entity-group') as HTMLElement;
  }

  it('lists the items the group holds', () => {
    init(groupTypeConfig_exclusive.id);

    const group = getGroup(entityGroup_exclusive_1.name);

    expect(within(group).getByTestId(addressedItem_1)).toBeInTheDocument();
    expect(within(group).getByTestId(plainItem_1)).toBeInTheDocument();
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

  it('shows a dragged item that the group takes it', () => {
    init(groupTypeConfig_exclusive.id);

    const group = getGroup(entityGroup_exclusive_1.name);

    fireEvent.dragStart(screen.getByTestId(addressedItem_2), { dataTransfer });
    fireEvent.dragOver(group, { dataTransfer });

    expect(group).toHaveClass('entity-group-dragging-over');
  });

  it('offers no drop target on a group the app provides', () => {
    init(groupTypeConfig_multi.id);

    const group = getGroup(entityGroup_protected.name);

    fireEvent.dragStart(
      within(getGroup(entityGroup_multi_1.name)).getByTestId(plainItem_1),
      { dataTransfer },
    );
    fireEvent.dragOver(group, { dataTransfer });

    expect(group).not.toHaveClass('entity-group-dragging-over');

    fireEvent.drop(group, { dataTransfer });

    expect(
      EntityGroups.get(groupTypeConfig_multi.id, entityGroup_protected.id)
        .items,
    ).toEqual([]);
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
});
