import { afterEach, describe, expect, it, vi } from 'vitest';
import { Events } from '@minddrop/events';
import {
  cleanup as cleanupRender,
  render,
  screen,
  userEvent,
  waitFor,
} from '@minddrop/test-utils';
import { SetSubviewEvent, Views } from '@minddrop/views';
import {
  ListPanelView,
  ListPanelViewItem,
  ListPanelViewProps,
} from './ListPanelView';

// Plain list items
const item1: ListPanelViewItem = { id: 'item-1', label: 'Item 1' };
const item2: ListPanelViewItem = { id: 'item-2', label: 'Item 2' };

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
  afterEach(() => {
    cleanupRender();
    Events._clearAll();
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
    Events.addListener(SetSubviewEvent, 'test', (data) => {
      announcements.push(data);
    });

    renderView({ items: [item1, item2] });

    // The first item should be announced as a replace, not a
    // navigation
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
    Events.addListener(SetSubviewEvent, 'test', (data) => {
      announcements.push(data);
    });

    // The selected item matches the subview, so mounting announces
    // nothing
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

  it('shows the empty state when there are no items', () => {
    renderView({ items: [] });

    screen.getByText('tags.list.empty');
  });

  it('shows the no results state when searching yields no items', () => {
    renderView({ items: [], query: 'query' });

    screen.getByText('tags.list.noResults');
  });

  it('renders labelled sections with their items', () => {
    renderView({
      sections: [{ id: 'section-1', stringLabel: 'Group 1', items: [item1] }],
    });

    screen.getByText('Group 1');
    screen.getByText('Item 1');
  });

  it('renders the section empty state inside empty labelled sections', () => {
    renderView({
      sections: [{ id: 'section-1', stringLabel: 'Group 1', items: [] }],
      sectionEmptyLabel: 'tags.details.entriesEmpty',
    });

    screen.getByText('tags.details.entriesEmpty');
  });

  it('hides the list empty state when sections are present', () => {
    renderView({
      sections: [{ id: 'section-1', stringLabel: 'Group 1', items: [] }],
    });

    // Only the sections' own empty states apply
    expect(screen.queryByText('tags.list.empty')).toBeNull();
  });

  it('renders custom section headers', () => {
    renderView({
      sections: [
        { id: 'section-1', header: <div>Custom header</div>, items: [item1] },
      ],
    });

    screen.getByText('Custom header');
  });

  it('collapses a labelled section when its label is clicked', async () => {
    const user = userEvent.setup();

    renderView({
      sections: [{ id: 'section-1', stringLabel: 'Group 1', items: [item1] }],
    });

    // Collapse the section
    await user.click(screen.getByText('Group 1'));

    // The section's items should be hidden
    await waitFor(() => {
      expect(screen.queryByText('Item 1')).toBeNull();
    });
  });
});
