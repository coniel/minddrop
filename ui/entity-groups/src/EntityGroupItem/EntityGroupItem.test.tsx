import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DragAndDrop } from '@minddrop/drag-and-drop';
import { dragAndDrop, dragOver } from '@minddrop/drag-and-drop/test-utils';
import { EntityGroups } from '@minddrop/entity-groups';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import {
  act,
  createDomRect,
  render,
  screen,
  within,
} from '@minddrop/test-utils';
import { EntityGroupList } from '../EntityGroupList';
import { cleanup, setup } from '../test-utils';
import { ProtectedEntityGroupProps } from '../types';
import { EntityGroupItem } from './EntityGroupItem';

const {
  addressedItem_1,
  addressedItem_2,
  entityGroup_exclusive_1,
  entityGroup_protected,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
  plainItem_1,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;

// The height the dropped-on item is measured at, since the
// environment lays nothing out. Which half of it a drop lands in
// decides whether the dragged item goes above or below it.
const itemHeight = 20;

describe('EntityGroupItem', () => {
  beforeEach(setup);

  afterEach(cleanup);

  function init() {
    return render(
      <EntityGroupList
        type={type}
        renderItem={(itemId) => <span data-testid={itemId}>{itemId}</span>}
      />,
    );
  }

  /**
   * Drags the item with the given ID and drops it on a row, at the
   * given distance from the row's top edge.
   *
   * @param itemId - The ID of the item to drag.
   * @param element - The row to drop on.
   * @param clientY - The drop's distance from the row's top edge.
   */
  function dropOn(itemId: string, element: HTMLElement, clientY: number) {
    dragAndDrop(screen.getByTestId(itemId), element, { clientX: 5, clientY });
  }

  /**
   * Returns the row of the item with the given ID, measured so that
   * the drop position can be read off the pointer position.
   *
   * @param itemId - The ID of the item.
   * @returns The item's row.
   */
  function getItem(itemId: string): HTMLElement {
    // Find the item's row
    const item = screen
      .getByTestId(itemId)
      .closest('.entity-group-item') as HTMLElement;

    // Measure the row at the item height
    vi.spyOn(item, 'getBoundingClientRect').mockReturnValue(
      createDomRect(0, 0, 100, itemHeight),
    );

    return item;
  }

  it('lists a dropped item above the item it was dropped on', () => {
    init();

    dropOn(addressedItem_2, getItem(plainItem_1), 2);

    expect(EntityGroups.get(type, entityGroup_exclusive_1.id).items).toEqual([
      addressedItem_1,
      addressedItem_2,
      plainItem_1,
    ]);
  });

  it('lists a dropped item below the item it was dropped on', () => {
    init();

    dropOn(addressedItem_2, getItem(plainItem_1), itemHeight - 2);

    expect(EntityGroups.get(type, entityGroup_exclusive_1.id).items).toEqual([
      addressedItem_1,
      plainItem_1,
      addressedItem_2,
    ]);
  });

  // The position a drop lands at is a position among the items the
  // group lists, which is not the position the item is shown at when
  // the list shows only some of them.
  it('lists a dropped item at the position among the items the group lists', () => {
    // A list showing all of the group's items but its first
    render(
      <EntityGroupList
        type={type}
        itemIds={[addressedItem_2, plainItem_1]}
        renderItem={(itemId) => <span data-testid={itemId}>{itemId}</span>}
      />,
    );

    dropOn(addressedItem_2, getItem(plainItem_1), 2);

    expect(EntityGroups.get(type, entityGroup_exclusive_1.id).items).toEqual([
      addressedItem_1,
      addressedItem_2,
      plainItem_1,
    ]);
  });

  it('collapses out of the list while dragged', () => {
    init();

    dragOver(screen.getByTestId(plainItem_1), document.body);

    expect(getItem(plainItem_1)).toHaveClass('entity-group-item-dragging');
  });

  // The app's groups keep listing what is dragged out of them, so
  // the drag copies the item rather than moving it.
  it('stays in place while dragged out of a group the app provides', () => {
    // The app's group lists its items itself
    const ProtectedItems: React.FC<ProtectedEntityGroupProps> = ({ group }) => (
      <EntityGroupItem itemId={plainItem_1} groupId={group.id} index={0}>
        <span data-testid={plainItem_1}>{plainItem_1}</span>
      </EntityGroupItem>
    );

    render(
      <EntityGroupList
        type={groupTypeConfig_multi.id}
        renderItem={(itemId) => <span data-testid={itemId}>{itemId}</span>}
        protectedGroupComponents={{
          [entityGroup_protected.id]: ProtectedItems,
        }}
      />,
    );

    const group = screen
      .getByText(entityGroup_protected.name)
      .closest('.entity-group') as HTMLElement;
    const content = within(group).getByTestId(plainItem_1);

    dragOver(content, document.body);

    expect(DragAndDrop.getActiveDrag()).toEqual(
      expect.objectContaining({ effect: 'copy' }),
    );
    expect(content.closest('.entity-group-item')).not.toHaveClass(
      'entity-group-item-dragging',
    );
  });

  it('marks where the dragged item would land while dragged over', () => {
    init();

    dragOver(screen.getByTestId(addressedItem_2), getItem(plainItem_1), {
      clientX: 5,
      clientY: 2,
    });

    expect(getItem(plainItem_1).querySelector('.drop-indicator')).toHaveClass(
      'drop-indicator-position-before',
    );
  });

  it('reorders the group when an item is dropped within it', () => {
    init();

    dropOn(plainItem_1, getItem(addressedItem_1), 2);

    expect(EntityGroups.get(type, entityGroup_exclusive_1.id).items).toEqual([
      plainItem_1,
      addressedItem_1,
    ]);
  });

  it('leaves the items the reorder did not move where they were', async () => {
    init();

    // A third item, so that an item moved into the middle of the
    // group has one on either side of it.
    await act(async () => {
      await EntityGroups.addItem(
        type,
        entityGroup_exclusive_1.id,
        addressedItem_2,
      );
    });

    dropOn(addressedItem_1, getItem(addressedItem_2), 2);

    expect(EntityGroups.get(type, entityGroup_exclusive_1.id).items).toEqual([
      plainItem_1,
      addressedItem_1,
      addressedItem_2,
    ]);
  });
});
