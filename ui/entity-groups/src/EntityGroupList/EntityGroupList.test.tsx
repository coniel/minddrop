import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { Selection } from '@minddrop/selection';
import {
  act,
  createEvent,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { cleanup, dragDataTransfer, setup } from '../test-utils';
import { EntityGroupList } from './EntityGroupList';

const {
  addressedItem_1,
  addressedItem_2,
  entityGroup_exclusive_2,
  entityGroup_multi_1,
  exclusiveGroups,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
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

  // Returns the gap above the group at the given position
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
  // the environment can express, and is left to end-to-end tests,
  // as is the pointer drag which reorders the groups themselves.
  it('stands up a group where items are dropped between two others', () => {
    const { container } = init();

    fireEvent.dragStart(screen.getByTestId(addressedItem_2), { dataTransfer });
    fireEvent.drop(getGap(container, 1), { dataTransfer });

    // The group takes shape holding the dropped item, waiting for
    // its name, with its header marked as what is being named.
    expect(screen.getByText('New group')).toBeInTheDocument();
    expect(screen.getByText('New group').closest('.menu-label')).toHaveClass(
      'menu-label-highlighted',
    );
    expect(screen.getByPlaceholderText('Group name')).toBeInTheDocument();
    expect(EntityGroups.getAll(type)).toHaveLength(exclusiveGroups.length);
  });

  it('says what a drop in the gap does while items are dragged over it', async () => {
    const { container } = init();

    fireEvent.dragStart(screen.getByTestId(addressedItem_2), { dataTransfer });
    fireEvent.dragOver(getGap(container, 1), { dataTransfer });

    expect(
      await screen.findByText('Drop here to create a new group.'),
    ).toBeInTheDocument();
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

  it('names a new group where a gap is right clicked, making it there', async () => {
    const { container } = init();

    fireEvent.contextMenu(getGap(container, 1));

    // The name is asked for in a menu, without a group taking shape
    expect(container.querySelector('.entity-group-placeholder')).toBeNull();
    expect(screen.getByRole('menu')).toBeInTheDocument();

    const nameField = screen.getByPlaceholderText('New group');

    fireEvent.change(nameField, { target: { value: 'My group' } });
    fireEvent.keyDown(nameField, { key: 'Enter' });

    await waitFor(() => {
      expect(EntityGroups.getAll(type)[1].name).toBe('My group');
    });

    expect(EntityGroups.getAll(type)[1].items).toEqual([]);
  });

  it('takes typing in the naming field', async () => {
    const { container } = init();

    fireEvent.contextMenu(getGap(container, 1));

    const nameField = screen.getByPlaceholderText('New group');

    await userEvent.type(nameField, 'My group');

    expect(nameField).toHaveValue('My group');
  });

  it('leaves right clicks in the naming popover to the popover', () => {
    const { container } = init();

    fireEvent.dragStart(screen.getByTestId(addressedItem_2), { dataTransfer });
    fireEvent.drop(getGap(container, 1), { dataTransfer });

    fireEvent.contextMenu(screen.getByPlaceholderText('Group name'));

    // No second naming opens over the one already under way
    expect(screen.getAllByPlaceholderText('Group name')).toHaveLength(1);
  });

  // The heights are applied by CSS, which the environment does not
  // apply, so the tests pin the classes the stylesheet keys off.
  describe('spacing', () => {
    it('keeps the expanded spacing below an expanded group', () => {
      const { container } = init();

      expect(getGap(container, 1)).not.toHaveClass('entity-group-gap-compact');
    });

    it('gives up the spacing between two collapsed groups', () => {
      EntityGroups.setCollapsed(type, exclusiveGroups[0].id, true);
      EntityGroups.setCollapsed(type, exclusiveGroups[1].id, true);

      const { container } = init();

      expect(getGap(container, 1)).toHaveClass('entity-group-gap-compact');
    });

    it('keeps the spacing below a collapsed group when the one below it is expanded', () => {
      EntityGroups.setCollapsed(type, exclusiveGroups[0].id, true);

      const { container } = init();

      expect(getGap(container, 1)).not.toHaveClass('entity-group-gap-compact');
    });

    it('keeps the spacing above a collapsed group when the one above it is expanded', () => {
      EntityGroups.setCollapsed(type, exclusiveGroups[1].id, true);

      const { container } = init();

      expect(getGap(container, 1)).not.toHaveClass('entity-group-gap-compact');
    });

    it('keeps the expanded spacing above the first group', () => {
      EntityGroups.setCollapsed(type, exclusiveGroups[0].id, true);

      const { container } = init();

      expect(getGap(container, 0)).not.toHaveClass('entity-group-gap-compact');
    });

    it('gives up the spacing below a collapsed last group', () => {
      const lastGroup = exclusiveGroups[exclusiveGroups.length - 1];

      EntityGroups.setCollapsed(type, lastGroup.id, true);

      const { container } = init();

      expect(getGap(container, exclusiveGroups.length)).toHaveClass(
        'entity-group-gap-compact',
      );
    });

    it('fills the rest of the list below the last group', () => {
      const { container } = init();

      expect(getGap(container, exclusiveGroups.length)).toHaveClass(
        'entity-group-gap-fill',
      );
    });
  });

  it('takes the naming key away from the control it was opened from', () => {
    const { container } = init();

    fireEvent.dragStart(screen.getByTestId(addressedItem_2), { dataTransfer });
    fireEvent.drop(getGap(container, 1), { dataTransfer });

    const nameField = screen.getByPlaceholderText('Group name');

    fireEvent.change(nameField, { target: { value: 'My group' } });

    // Committing closes the field, and the browser would fire the
    // key's default activation at whatever the focus returns to,
    // pressing the control the naming was started from
    const event = createEvent.keyDown(nameField, { key: 'Enter' });

    fireEvent(nameField, event);

    expect(event.defaultPrevented).toBe(true);
  });
});
