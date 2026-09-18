import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentViewGroups } from '@minddrop/content-views';
import { ContentViewFixtures } from '@minddrop/content-views/test-utils';
import { Events } from '@minddrop/events';
import {
  cleanup as cleanupRender,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '@minddrop/test-utils';
import { OpenNewContentViewViewEvent } from '../events';
import { cleanup, setup } from '../test-utils';
import { ContentViewsView } from './ContentViewsView';

const {
  contentView_gallery_1,
  contentView_gallery_2,
  contentViewGroup_1,
  contentViewGroup_2,
} = ContentViewFixtures;

// Returns the element of the group with the given name
function getGroup(name: string): HTMLElement {
  return screen.getByText(name).closest('.entity-group') as HTMLElement;
}

describe('<ContentViewsView />', () => {
  beforeEach(setup);

  afterEach(async () => {
    cleanupRender();
    await cleanup();
  });

  it('lists the persisted content views', () => {
    render(<ContentViewsView />);

    screen.getByText(contentView_gallery_1.name);
  });

  it("opens a view's settings menu from its list item", () => {
    render(<ContentViewsView />);

    fireEvent.contextMenu(screen.getByText(contentView_gallery_1.name));

    expect(
      screen.getByDisplayValue(contentView_gallery_1.name),
    ).toBeInTheDocument();
  });

  it('lists the views under the groups holding them', async () => {
    await ContentViewGroups.addItem(
      contentViewGroup_1.id,
      contentView_gallery_1.id,
    );

    render(<ContentViewsView />);

    expect(
      within(getGroup(contentViewGroup_1.name)).getByText(
        contentView_gallery_1.name,
      ),
    ).toBeInTheDocument();
    expect(
      within(getGroup('Ungrouped')).getByText(contentView_gallery_2.name),
    ).toBeInTheDocument();
  });

  it("creates a view in a group from the group's add button", async () => {
    const user = userEvent.setup();
    // The open event the creation form is opened by
    let opened: { viewType: string; groupId?: string } | null = null;

    Events.addListener(
      OpenNewContentViewViewEvent,
      'test-open-new-view',
      (data) => {
        opened = data;
      },
    );

    render(<ContentViewsView />);

    // Pick a view type from the group's add button
    await user.click(
      within(getGroup(contentViewGroup_2.name)).getByLabelText(
        'contentViews.actions.add',
      ),
    );
    await user.click(await screen.findByText('gallery'));

    await waitFor(() => {
      expect(opened).toEqual({
        viewType: 'gallery',
        groupId: contentViewGroup_2.id,
      });
    });
  });

  it('lists the matches without their groups while searching', async () => {
    const user = userEvent.setup();

    await ContentViewGroups.addItem(
      contentViewGroup_1.id,
      contentView_gallery_1.id,
    );

    render(<ContentViewsView />);

    await user.type(
      screen.getByPlaceholderText('contentViews.list.searchPlaceholder'),
      contentView_gallery_1.name,
    );

    await waitFor(() => {
      expect(screen.queryByText(contentViewGroup_1.name)).toBeNull();
    });

    expect(screen.queryByText('Ungrouped')).toBeNull();
    expect(getListedNames()).toEqual([contentView_gallery_1.name]);
  });
});

/**
 * Returns the names of every view listed in the left column, in the
 * order they are shown.
 */
function getListedNames(): (string | null)[] {
  const list = document.querySelector(
    '.list-panel-view-list-items',
  ) as HTMLElement;

  return Array.from(list.querySelectorAll('.menu-item-label')).map(
    (label) => label.textContent,
  );
}
