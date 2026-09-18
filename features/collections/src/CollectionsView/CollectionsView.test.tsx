import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CollectionGroups } from '@minddrop/collections';
import {
  CollectionFixtures,
  CollectionGroupFixtures,
} from '@minddrop/collections/test-utils';
import {
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '@minddrop/test-utils';
import { Views } from '@minddrop/views';
import { cleanup, setup } from '../test-utils';
import { CollectionsView } from './CollectionsView';

const { collection_1, collection_2 } = CollectionFixtures;
const { collectionGroup_1, collectionGroup_2 } = CollectionGroupFixtures;

// Renders the view inside a subview context
function renderView() {
  return render(
    <Views.SubviewProvider subview={null}>
      <CollectionsView />
    </Views.SubviewProvider>,
  );
}

// Returns the element of the group with the given name
function getGroup(name: string): HTMLElement {
  return screen.getByText(name).closest('.entity-group') as HTMLElement;
}

describe('<CollectionsView />', () => {
  beforeEach(setup);

  afterEach(cleanup);

  it('lists the collections under the groups holding them', async () => {
    await CollectionGroups.addItem(collectionGroup_1.id, collection_1.id);

    renderView();

    expect(
      within(getGroup(collectionGroup_1.name)).getByText(collection_1.name),
    ).toBeInTheDocument();
    expect(
      within(getGroup('Ungrouped')).getByText(collection_2.name),
    ).toBeInTheDocument();
  });

  it("creates a collection in a group from the group's add button", async () => {
    const user = userEvent.setup();

    renderView();

    await user.click(
      within(getGroup(collectionGroup_2.name)).getByLabelText('New collection'),
    );

    await waitFor(() => {
      expect(CollectionGroups.get(collectionGroup_2.id).items).toHaveLength(1);
    });
  });

  it('lists the matches without their groups while searching', async () => {
    const user = userEvent.setup();

    await CollectionGroups.addItem(collectionGroup_1.id, collection_1.id);

    renderView();

    await user.type(
      screen.getByPlaceholderText('Search collections...'),
      collection_1.name,
    );

    await waitFor(() => {
      expect(screen.queryByText(collectionGroup_1.name)).toBeNull();
    });

    expect(screen.queryByText('Ungrouped')).toBeNull();
    expect(getListedNames()).toEqual([collection_1.name]);
  });
});

/**
 * Returns the names of every collection listed in the left column,
 * in the order they are shown.
 */
function getListedNames(): (string | null)[] {
  const list = document.querySelector(
    '.list-panel-view-list-items',
  ) as HTMLElement;

  return Array.from(list.querySelectorAll('.menu-item-label')).map(
    (label) => label.textContent,
  );
}
