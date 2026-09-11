import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import {
  act,
  createEvent,
  fireEvent,
  render,
  screen,
} from '@minddrop/test-utils';
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

// The height the dropped-on item is measured at, since jsdom lays
// nothing out. Which half of it a drop lands in decides whether the
// dragged item goes above or below it.
const itemHeight = 20;

let dataTransfer = dragDataTransfer();

describe('EntityGroupItem', () => {
  beforeEach(() => {
    setup();

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

  it('makes its item draggable', () => {
    init();

    expect(getItem(plainItem_1)).toHaveAttribute('draggable', 'true');
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
});
