import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { Selection } from '@minddrop/selection';
import { act, fireEvent, render, screen, waitFor } from '@minddrop/test-utils';
import { cleanup, dragDataTransfer, setup } from '../test-utils';
import { EntityGroupList } from './EntityGroupList';

const {
  addressedItem_1,
  addressedItem_2,
  entityGroup_multi_1,
  groupTypeConfig_multi,
  entityGroup_exclusive_1,
  entityGroup_exclusive_2,
  entityGroup_exclusive_empty,
  exclusiveGroups,
  groupTypeConfig_exclusive,
  plainItem_1,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;

let dataTransfer = dragDataTransfer();

describe('EntityGroupList', () => {
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

  // Returns the element of the group with the given name
  function getGroup(name: string): HTMLElement {
    return screen.getByText(name).closest('.entity-group') as HTMLElement;
  }

  // Returns the space above the group at the given position
  function getGap(container: HTMLElement, index: number): HTMLElement {
    return container.querySelectorAll('.entity-group-gap')[
      index
    ] as HTMLElement;
  }

  it('lists the type groups in the order they are stored', () => {
    const { container } = init();

    const names = Array.from(container.querySelectorAll('.menu-label')).map(
      (label) => label.textContent,
    );

    expect(names).toEqual(exclusiveGroups.map((group) => group.name));
  });

  // Covers the routing from a drop to the model call it stands for.
  // The gesture in between the drag start and the drop is not one
  // the environment can express, and is left to end-to-end tests.
  it('moves a group dropped between two others to that position', () => {
    const { container } = init();

    fireEvent.dragStart(getGroup(entityGroup_exclusive_1.name), {
      dataTransfer,
    });
    fireEvent.drop(getGap(container, 2), { dataTransfer });

    expect(EntityGroups.getAll(type).map((group) => group.id)).toEqual([
      entityGroup_exclusive_2.id,
      entityGroup_exclusive_1.id,
      entityGroup_exclusive_empty.id,
    ]);
  });

  it('stands up a group where items are dropped between two others', () => {
    const { container } = init();

    fireEvent.dragStart(screen.getByTestId(addressedItem_2), { dataTransfer });
    fireEvent.drop(getGap(container, 1), { dataTransfer });

    // The group takes shape holding the dropped item, waiting for
    // its name.
    expect(screen.getByText('New group')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Group name')).toBeInTheDocument();
    expect(EntityGroups.getAll(type)).toHaveLength(exclusiveGroups.length);
  });

  it('creates the named group at the position, holding the items', async () => {
    const { container } = init();

    fireEvent.dragStart(screen.getByTestId(addressedItem_2), { dataTransfer });
    fireEvent.drop(getGap(container, 1), { dataTransfer });

    const nameField = screen.getByPlaceholderText('Group name');

    fireEvent.change(nameField, { target: { value: 'My group' } });
    fireEvent.keyDown(nameField, { key: 'Enter' });

    await waitFor(() => {
      expect(EntityGroups.getAll(type)[1].name).toBe('My group');
    });

    const created = EntityGroups.getAll(type)[1];

    expect(created.items).toEqual([addressedItem_2]);
    // The item left the group it was dragged out of
    expect(EntityGroups.get(type, entityGroup_exclusive_2.id).items).toEqual(
      [],
    );
  });

  it('moves an item dragged out of a group into the new group', async () => {
    // A type whose items can belong to several groups, so an item
    // which stayed behind would be one the drop copied.
    const multiType = groupTypeConfig_multi.id;

    const { container } = render(
      <EntityGroupList
        type={multiType}
        renderItem={(itemId) => <span data-testid={itemId}>{itemId}</span>}
      />,
    );

    fireEvent.dragStart(screen.getByTestId(plainItem_1), { dataTransfer });
    fireEvent.drop(getGap(container, 0), { dataTransfer });

    const nameField = screen.getByPlaceholderText('Group name');

    fireEvent.change(nameField, { target: { value: 'My group' } });
    fireEvent.keyDown(nameField, { key: 'Enter' });

    await waitFor(() => {
      expect(EntityGroups.getAll(multiType)[0].name).toBe('My group');
    });

    expect(EntityGroups.getAll(multiType)[0].items).toEqual([plainItem_1]);
    expect(EntityGroups.get(multiType, entityGroup_multi_1.id).items).toEqual([
      addressedItem_1,
    ]);
  });

  it('adds an item dragged in from outside the list to the new group', async () => {
    // A type whose items can belong to several groups, so an item
    // added to the new group goes on being listed where it was.
    const multiType = groupTypeConfig_multi.id;

    const { container } = render(
      <EntityGroupList
        type={multiType}
        renderItem={(itemId) => <span data-testid={itemId}>{itemId}</span>}
      />,
    );

    // A drag of one of the type's entities from elsewhere in the
    // app, which leaves the list none the wiser about where it came
    // from.
    act(() => {
      Selection.select([
        { id: addressedItem_1, type: 'addressed-item', data: {} },
      ]);
      Selection.Store.getState().setIsDragging(true);
    });

    fireEvent.drop(getGap(container, 0), { dataTransfer });

    const nameField = screen.getByPlaceholderText('Group name');

    fireEvent.change(nameField, { target: { value: 'My group' } });
    fireEvent.keyDown(nameField, { key: 'Enter' });

    await waitFor(() => {
      expect(EntityGroups.getAll(multiType)[0].name).toBe('My group');
    });

    expect(EntityGroups.getAll(multiType)[0].items).toEqual([addressedItem_1]);
    // The groups already listing the item keep it
    expect(EntityGroups.get(multiType, entityGroup_multi_1.id).items).toEqual(
      entityGroup_multi_1.items,
    );
  });
});
