import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { dragAndDrop, dragOver } from '@minddrop/drag-and-drop/test-utils';
import { EntityGroups } from '@minddrop/entity-groups';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import {
  createEvent,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '@minddrop/test-utils';
import { ExternalDragSource, cleanup, setup } from '../test-utils';
import { EntityGroupList } from './EntityGroupList';

const {
  addressedItem_1,
  addressedItem_2,
  entityGroup_exclusive_1,
  entityGroup_exclusive_2,
  entityGroup_multi_1,
  exclusiveGroups,
  groupTypeConfig_exclusive,
  groupTypeConfig_multi,
  plainItem_1,
  plainItem_2,
} = EntityGroupFixtures;

const type = groupTypeConfig_exclusive.id;

// Every item the exclusive type's groups are listed against, of
// which only plainItem_2 is in none of them.
const itemIds = [addressedItem_1, addressedItem_2, plainItem_1, plainItem_2];

describe('EntityGroupList', () => {
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

  // Renders the list against the type's full item set. The ungrouped
  // group is derived from it.
  function initWithItems(listItemIds = itemIds) {
    return render(
      <EntityGroupList
        type={type}
        itemIds={listItemIds}
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

  // The pointer drag which reorders the groups themselves is left
  // to end-to-end tests.
  it('stands up a group where items are dropped between two others', () => {
    const { container } = init();

    dragAndDrop(screen.getByTestId(addressedItem_2), getGap(container, 1));

    // Find the new group's label
    const label = screen.getByText('New group', {
      selector: '.menu-label-text',
    });

    // The group takes shape holding the dropped item, waiting for
    // its name, with its header marked as what is being named.
    expect(label.closest('.menu-label')).toHaveClass('menu-label-highlighted');
    expect(screen.getByPlaceholderText('Group name')).toBeInTheDocument();
    expect(EntityGroups.getAll(type)).toHaveLength(exclusiveGroups.length);
  });

  it('says what a drop in the gap does while items are dragged over it', async () => {
    const { container } = init();

    dragOver(screen.getByTestId(addressedItem_2), getGap(container, 1));

    expect(
      await screen.findByText('Drop here to create a new group.'),
    ).toBeInTheDocument();
  });

  it('creates the named group at the position, holding the items', async () => {
    const { container } = init();

    dragAndDrop(screen.getByTestId(addressedItem_2), getGap(container, 1));

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

    dragAndDrop(screen.getByTestId(plainItem_1), getGap(container, 0));

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

    // Render the list with a drag source from elsewhere in the app.
    // The drag has no group origin.
    const { container } = render(
      <>
        <ExternalDragSource itemId={addressedItem_1} />
        <EntityGroupList
          type={multiType}
          renderItem={(itemId) => <span data-testid={itemId}>{itemId}</span>}
        />
      </>,
    );

    dragAndDrop(
      screen.getByTestId(`external:${addressedItem_1}`),
      getGap(container, 0),
    );

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

  it('says so when a gap is named after a group which exists', async () => {
    const { container } = init();

    fireEvent.contextMenu(getGap(container, 1));

    const nameField = screen.getByPlaceholderText('New group');

    fireEvent.change(nameField, {
      target: { value: entityGroup_exclusive_1.name },
    });
    fireEvent.keyDown(nameField, { key: 'Enter' });

    expect(
      await screen.findByText('A group with this name already exists'),
    ).toBeInTheDocument();

    // The naming goes on, and no group was made
    expect(screen.getByPlaceholderText('New group')).toBeInTheDocument();
    expect(EntityGroups.getAll(type)).toHaveLength(exclusiveGroups.length);
  });

  it('says so when the group taking shape is named after one which exists', async () => {
    const { container } = init();

    dragAndDrop(screen.getByTestId(addressedItem_2), getGap(container, 1));

    const nameField = screen.getByPlaceholderText('Group name');

    fireEvent.change(nameField, {
      target: { value: entityGroup_exclusive_1.name },
    });
    fireEvent.keyDown(nameField, { key: 'Enter' });

    expect(
      await screen.findByText('A group with this name already exists'),
    ).toBeInTheDocument();

    // The group goes on taking shape around the dropped item
    expect(container.querySelector('.entity-group-placeholder')).not.toBeNull();
    expect(EntityGroups.getAll(type)).toHaveLength(exclusiveGroups.length);
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

    dragAndDrop(screen.getByTestId(addressedItem_2), getGap(container, 1));

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

    it('keeps the expanded spacing at the top of the list', () => {
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

    it('gives up the spacing between a collapsed ungrouped group and a collapsed group', () => {
      EntityGroups.setCollapsed(type, EntityGroups.constants.UngroupedId, true);
      EntityGroups.setCollapsed(type, exclusiveGroups[0].id, true);

      const { container } = initWithItems();

      expect(getGap(container, 0)).toHaveClass('entity-group-gap-compact');
    });

    it('keeps the spacing below a collapsed ungrouped group when the group below it is expanded', () => {
      EntityGroups.setCollapsed(type, EntityGroups.constants.UngroupedId, true);

      const { container } = initWithItems();

      expect(getGap(container, 0)).not.toHaveClass('entity-group-gap-compact');
    });

    it('fills the rest of the list below the last group', () => {
      const { container } = init();

      expect(getGap(container, exclusiveGroups.length)).toHaveClass(
        'entity-group-gap-fill',
      );
    });
  });

  describe('the ungrouped group', () => {
    // Returns the ungrouped group's element
    function getUngrouped(): HTMLElement {
      return screen
        .getByText('Ungrouped')
        .closest('.entity-group') as HTMLElement;
    }

    it("lists the items in none of the type's groups", () => {
      initWithItems();

      const group = getUngrouped();

      expect(within(group).getByTestId(plainItem_2)).toBeInTheDocument();
      expect(within(group).queryByTestId(addressedItem_1)).toBeNull();
    });

    it('takes the items dropped on it out of the groups holding them', async () => {
      initWithItems();

      dragAndDrop(screen.getByTestId(addressedItem_2), getUngrouped());

      await waitFor(() => {
        expect(
          EntityGroups.get(type, entityGroup_exclusive_2.id).items,
        ).toEqual([]);
      });
    });

    it('offers no actions of its own', () => {
      initWithItems();

      expect(within(getUngrouped()).queryByLabelText('Options')).toBeNull();
    });

    it('is not one of the groups the list rearranges', () => {
      const { container } = initWithItems();

      const sortable = container.querySelector('.sortable-list');

      expect(sortable?.contains(getUngrouped())).toBe(false);
    });

    it('is left out when every item is in a group', () => {
      initWithItems([addressedItem_1, addressedItem_2, plainItem_1]);

      expect(screen.queryByText('Ungrouped')).toBeNull();
    });

    it('is left out for a type which does not have one', () => {
      render(
        <EntityGroupList
          type={groupTypeConfig_multi.id}
          itemIds={itemIds}
          renderItem={(itemId) => <span data-testid={itemId}>{itemId}</span>}
        />,
      );

      expect(screen.queryByText('Ungrouped')).toBeNull();
    });
  });

  it('takes the naming key away from the control it was opened from', () => {
    const { container } = init();

    dragAndDrop(screen.getByTestId(addressedItem_2), getGap(container, 1));

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
