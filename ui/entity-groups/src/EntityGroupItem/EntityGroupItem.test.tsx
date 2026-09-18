import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { Selection } from '@minddrop/selection';
import {
  act,
  createEvent,
  fireEvent,
  render,
  screen,
} from '@minddrop/test-utils';
import { resetHoveredItem } from '@minddrop/ui-drag-and-drop';
import { entityIdType } from '@minddrop/utils';
import { EntityGroupList } from '../EntityGroupList';
import { cleanup, dragDataTransfer, setup } from '../test-utils';

const {
  addressedItem_1,
  addressedItem_2,
  entityGroup_exclusive_1,
  groupTypeConfig_exclusive,
  plainItem_1,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;

// A consumer's row which is draggable in its own right, as a list
// panel view's rows are.
const DraggableRow: React.FC<{ itemId: string }> = ({ itemId }) => {
  const { draggableProps } = Selection.useDraggable({
    id: itemId,
    type: entityIdType(itemId) ?? '',
    data: { id: itemId },
  });

  return (
    <span data-testid={itemId} {...draggableProps}>
      {itemId}
    </span>
  );
};

// The height the dropped-on item is measured at, since jsdom lays
// nothing out. Which half of it a drop lands in decides whether the
// dragged item goes above or below it.
const itemHeight = 20;

let dataTransfer = dragDataTransfer();

describe('EntityGroupItem', () => {
  beforeEach(() => {
    setup();

    // The hovered item is held outside React, for the app's lifetime
    resetHoveredItem();

    // A fresh transfer per test, since a drag carries its own
    dataTransfer = dragDataTransfer();
  });

  afterEach(cleanup);

  function init() {
    return render(
      <EntityGroupList
        type={type}
        renderItem={(itemId) => <span data-testid={itemId}>{itemId}</span>}
      />,
    );
  }

  // Drops the dragged item on a row, at the given distance from its
  // top edge. The pointer position is set on the event by hand,
  // which the environment's drag events do not carry.
  function dropOn(element: HTMLElement, clientY: number) {
    const event = createEvent.drop(element, { dataTransfer });

    Object.defineProperty(event, 'clientY', { value: clientY });

    fireEvent(element, event);
  }

  // Returns the row of the item with the given ID, measured so that
  // the drop position can be read off the pointer position.
  function getItem(itemId: string): HTMLElement {
    const item = screen
      .getByTestId(itemId)
      .closest('.entity-group-item') as HTMLElement;

    vi.spyOn(item, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      left: 0,
      bottom: itemHeight,
      right: 100,
      width: 100,
      height: itemHeight,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    return item;
  }

  // Covers the routing from a drop to the model call it stands for.
  // The gesture in between the drag start and the drop is not one
  // the environment can express, and is left to end-to-end tests.
  it('lists a dropped item above the item it was dropped on', () => {
    init();

    fireEvent.dragStart(screen.getByTestId(addressedItem_2), { dataTransfer });
    dropOn(getItem(plainItem_1), 2);

    expect(EntityGroups.get(type, entityGroup_exclusive_1.id).items).toEqual([
      addressedItem_1,
      addressedItem_2,
      plainItem_1,
    ]);
  });

  it('lists a dropped item below the item it was dropped on', () => {
    init();

    fireEvent.dragStart(screen.getByTestId(addressedItem_2), { dataTransfer });
    dropOn(getItem(plainItem_1), itemHeight - 2);

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

    fireEvent.dragStart(screen.getByTestId(addressedItem_2), { dataTransfer });
    dropOn(getItem(plainItem_1), 2);

    expect(EntityGroups.get(type, entityGroup_exclusive_1.id).items).toEqual([
      addressedItem_1,
      addressedItem_2,
      plainItem_1,
    ]);
  });

  it('makes its item draggable', () => {
    init();

    expect(getItem(plainItem_1)).toHaveAttribute('draggable', 'true');
  });

  // A consumer's own draggable stops the drag start from reaching
  // the item, which marks the drag with the group it came out of.
  it("takes a drop of an item dragged by the consumer's own draggable", () => {
    render(
      <EntityGroupList
        type={type}
        renderItem={(itemId) => <DraggableRow itemId={itemId} />}
      />,
    );

    fireEvent.dragStart(screen.getByTestId(plainItem_1), { dataTransfer });
    dropOn(getItem(addressedItem_1), 2);

    expect(EntityGroups.get(type, entityGroup_exclusive_1.id).items).toEqual([
      plainItem_1,
      addressedItem_1,
    ]);
  });

  it('reorders the group when an item is dropped within it', () => {
    init();

    fireEvent.dragStart(screen.getByTestId(plainItem_1), { dataTransfer });
    dropOn(getItem(addressedItem_1), 2);

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

    fireEvent.dragStart(screen.getByTestId(addressedItem_1), { dataTransfer });
    dropOn(getItem(addressedItem_2), 2);

    expect(EntityGroups.get(type, entityGroup_exclusive_1.id).items).toEqual([
      plainItem_1,
      addressedItem_1,
      addressedItem_2,
    ]);
  });

  describe('hover', () => {
    it('hovers the item the pointer is over', () => {
      init();

      fireEvent.pointerOver(getItem(plainItem_1));

      expect(getItem(plainItem_1)).toHaveAttribute('data-hovered', 'true');
    });

    it('hovers one item at a time', () => {
      init();

      fireEvent.pointerOver(getItem(plainItem_1));
      fireEvent.pointerOver(getItem(addressedItem_1));

      expect(getItem(plainItem_1)).toHaveAttribute('data-hovered', 'false');
    });

    // The list reorders around a drop, and the browser announces
    // whatever lands under the stationary pointer as newly entered.
    it('hovers nothing until the pointer moves after a drag', () => {
      init();

      fireEvent.dragStart(screen.getByTestId(addressedItem_1), {
        dataTransfer,
      });
      fireEvent.pointerOver(getItem(plainItem_1));

      expect(getItem(plainItem_1)).toHaveAttribute('data-hovered', 'false');
    });
  });
});
