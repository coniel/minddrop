import { useMemo, useState } from 'react';
import { Events } from '@minddrop/events';
import { Space, Spaces } from '@minddrop/spaces';
import { ListPanelView, ListPanelViewItem } from '@minddrop/ui-components';
import { IconButton } from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';
import { SpaceContent } from './SpaceContent';
import { OpenNewSpaceDialogEvent, OpenSpaceViewEvent } from './events';

/**
 * Renders a two column view of the spaces: a searchable list of
 * spaces on the left, and the selected space's layout on the right.
 */
export const SpacesView: React.FC = () => {
  const [query, setQuery] = useState('');
  const subview = Views.useSubview();
  const openView = Views.useOpenView();
  const spaces = Spaces.useAll();
  const selectedSpace = Spaces.use(subview?.id ?? '');

  // Spaces listed in the left column: fuzzy name matches when
  // searching, all spaces otherwise
  const items = useMemo(
    () => (query ? Spaces.search(query) : spaces).map(toListItem),
    [spaces, query],
  );

  // The space rendered by the panel's content
  const selectedItem = useMemo(
    () => selectedSpace && toListItem(selectedSpace),
    [selectedSpace],
  );

  // Open the new space dialog
  function handleCreateSpace() {
    Events.dispatch(OpenNewSpaceDialogEvent);
  }

  // Open the selected space in a view of its own
  function handleExpandSpace() {
    openView(OpenSpaceViewEvent, {
      spaceId: selectedSpace?.id ?? '',
    });
  }

  return (
    <ListPanelView
      icon="shapes"
      title="spaces.labels.spaces"
      items={items}
      selectedItem={selectedItem}
      query={query}
      onQueryChange={setQuery}
      onExpandItem={handleExpandSpace}
      searchPlaceholder="spaces.list.searchPlaceholder"
      emptyLabel="spaces.list.empty"
      noResultsLabel="spaces.list.noResults"
      noSelectionLabel="spaces.details.noSelection"
      addAction={
        <IconButton
          icon="plus"
          size="md"
          variant="subtle"
          label="spaces.actions.new"
          onClick={handleCreateSpace}
        />
      }
    >
      {selectedSpace && <SpaceContent space={selectedSpace} />}
    </ListPanelView>
  );
};

/**
 * Returns the space as a list item.
 */
function toListItem(space: Space): ListPanelViewItem {
  return {
    id: space.id,
    label: space.name,
    contentIcon: space.icon,
  };
}
