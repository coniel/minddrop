import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import {
  EntityGroupFixtures,
  cleanup as cleanupEntityGroups,
  setup as setupEntityGroups,
} from '@minddrop/entity-groups/test-utils';
import { Events } from '@minddrop/events';
import {
  cleanup as cleanupRender,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '@minddrop/test-utils';
import { initializeEntityGroupsUi } from '@minddrop/ui-entity-groups';
import { Views } from '@minddrop/views';
import {
  ListPanelView,
  ListPanelViewItem,
  ListPanelViewProps,
} from './ListPanelView';

// Register the entity group translations. The grouped list renders
// its chrome with them.
initializeEntityGroupsUi();

const {
  addressedItem_1,
  addressedItem_2,
  entityGroup_exclusive_1,
  groupTypeConfig_exclusive,
  plainItem_1,
  plainItem_2,
} = EntityGroupFixtures;

// Plain list items
const item1: ListPanelViewItem = { id: 'item-1', label: 'Item 1' };
const item2: ListPanelViewItem = { id: 'item-2', label: 'Item 2' };

// The group fixtures' items as list items, labelled by their IDs
const groupedItems: ListPanelViewItem[] = [
  addressedItem_1,
  addressedItem_2,
  plainItem_1,
  plainItem_2,
].map((id) => ({ id, label: id }));

// Renders the view with sensible defaults inside a subview context
function renderView(
  props: Partial<ListPanelViewProps> = {},
  subview: { id: string; title: string } | null = null,
) {
  return render(
    <Views.SubviewProvider subview={subview}>
      <ListPanelView
        query=""
        onQueryChange={() => {}}
        searchPlaceholder="test"
        emptyLabel="tags.list.empty"
        noResultsLabel="tags.list.noResults"
        noSelectionLabel="tags.details.noSelection"
        {...props}
      />
    </Views.SubviewProvider>,
  );
}

describe('<ListPanelView />', () => {
  beforeEach(setupEntityGroups);

  afterEach(async () => {
    cleanupRender();
    await cleanupEntityGroups();
    vi.clearAllMocks();
  });

  it('lists the items', () => {
    renderView({ items: [item1, item2] });

    screen.getByText('Item 1');
    screen.getByText('Item 2');
  });

  it('announces the first item as the fallback subview', async () => {
    const announcements: unknown[] = [];

    // Capture subview announcements
    Events.addListener(Views.events.SetSubview, 'test', (data) => {
      announcements.push(data);
    });

    renderView({ items: [item1, item2] });

    // The first item should be announced as a replace, not a
    // navigation.
    await waitFor(() => {
      expect(announcements).toContainEqual(
        expect.objectContaining({
          subview: expect.objectContaining({ id: item1.id }),
          replace: true,
        }),
      );
    });
  });

  it('announces the clicked item as the subview', async () => {
    const announcements: { replace?: boolean }[] = [];
    const user = userEvent.setup();

    // Capture subview announcements
    Events.addListener(Views.events.SetSubview, 'test', (data) => {
      announcements.push(data);
    });

    // The selected item matches the subview, so mounting announces
    // nothing.
    renderView(
      { items: [item1, item2], selectedItem: item1 },
      { id: item1.id, title: item1.label },
    );

    await user.click(screen.getByText('Item 2'));

    // The clicked item should be announced as a navigation
    await waitFor(() => {
      expect(announcements).toContainEqual(
        expect.objectContaining({
          subview: expect.objectContaining({ id: item2.id }),
        }),
      );
    });
  });

  it('calls onDoubleClickItem with the double clicked item', async () => {
    const doubleClicked: ListPanelViewItem[] = [];
    const user = userEvent.setup();

    renderView({
      items: [item1, item2],
      onDoubleClickItem: (item) => doubleClicked.push(item),
    });

    await user.dblClick(screen.getByText('Item 2'));

    expect(doubleClicked).toEqual([item2]);
  });

  it('shows the empty state when there are no items', () => {
    renderView({ items: [] });

    screen.getByText('tags.list.empty');
  });

  it('shows the no results state when searching yields no items', () => {
    renderView({ items: [], query: 'query' });

    screen.getByText('tags.list.noResults');
  });

  describe('grouped items', () => {
    // Renders the panel with its items grouped by the fixture type
    function renderGrouped(props: Partial<ListPanelViewProps> = {}) {
      return renderView({
        items: groupedItems,
        groups: { type: groupTypeConfig_exclusive.id },
        ...props,
      });
    }

    // Returns the element of the group with the given name
    function getGroup(name: string): HTMLElement {
      return screen.getByText(name).closest('.entity-group') as HTMLElement;
    }

    it('lists the items under the groups holding them', () => {
      renderGrouped();

      const group = getGroup(entityGroup_exclusive_1.name);

      expect(within(group).getByText(addressedItem_1)).toBeInTheDocument();
      expect(within(group).getByText(plainItem_1)).toBeInTheDocument();
    });

    it('renders nothing for an ID no listed item has', () => {
      renderGrouped({ items: groupedItems.slice(1) });

      expect(screen.queryByText(addressedItem_1)).toBeNull();
    });

    it('lists the items in no group under the ungrouped group', () => {
      renderGrouped();

      expect(
        within(getGroup('Ungrouped')).getByText(plainItem_2),
      ).toBeInTheDocument();
    });

    it('announces a clicked row as the subview', async () => {
      const announcements: unknown[] = [];
      const user = userEvent.setup();

      // Capture subview announcements
      Events.addListener(Views.events.SetSubview, 'test', (data) => {
        announcements.push(data);
      });

      renderGrouped({
        selectedItem: groupedItems[0],
      });

      await user.click(screen.getByText(plainItem_1));

      await waitFor(() => {
        expect(announcements).toContainEqual(
          expect.objectContaining({
            subview: expect.objectContaining({ id: plainItem_1 }),
          }),
        );
      });
    });

    // A lone 'Ungrouped' header groups nothing
    it('lists the items flat when the type has no groups of its own', async () => {
      // Leave the type with nothing but its ungrouped group
      await Promise.all(
        EntityGroups.getAll(groupTypeConfig_exclusive.id)
          .filter(({ id }) => id !== EntityGroups.constants.UngroupedId)
          .map(({ id }) =>
            EntityGroups.delete(groupTypeConfig_exclusive.id, id),
          ),
      );

      renderGrouped();

      expect(screen.queryByText('Ungrouped')).toBeNull();
      expect(screen.getByText(addressedItem_1)).toBeInTheDocument();
    });

    // A group's own order would shuffle a ranked list
    it('lists the matches without their groups while searching', () => {
      renderGrouped({
        items: [{ id: addressedItem_1, label: addressedItem_1 }],
        query: 'query',
      });

      expect(screen.getByText(addressedItem_1)).toBeInTheDocument();
      expect(screen.queryByText(entityGroup_exclusive_1.name)).toBeNull();
      expect(screen.queryByText('Ungrouped')).toBeNull();
    });

    it('shows the no results state when a search matches nothing', () => {
      renderGrouped({ items: [], query: 'query' });

      screen.getByText('tags.list.noResults');
    });

    it('keeps the empty state to itself when the type has groups', () => {
      renderGrouped({ items: [] });

      expect(screen.queryByText('tags.list.empty')).toBeNull();
    });
  });
});
