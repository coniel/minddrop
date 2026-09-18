import { useMemo, useState } from 'react';
import { Designs } from '@minddrop/designs';
import { EntityGroup, EntityGroups } from '@minddrop/entity-groups';
import { Events } from '@minddrop/events';
import { Space, SpaceGroups, Spaces } from '@minddrop/spaces';
import { ListPanelView, ListPanelViewItem } from '@minddrop/ui-components';
import {
  EntityGroupAddAction,
  useEntityGroupSubmenu,
} from '@minddrop/ui-entity-groups';
import { SubmenuContents } from '@minddrop/ui-primitives';
import { orderByName } from '@minddrop/utils';
import { Views } from '@minddrop/views';
import { SpaceContent } from '../SpaceContent';
import { setSpaceViewState } from '../SpaceViewStateStore';
import { OpenNewSpaceDialogEvent, OpenSpaceViewEvent } from '../events';
import { NewSpaceMenu } from './NewSpaceMenu';

/**
 * Renders a two column view of the spaces: a searchable list of
 * spaces grouped by space group on the left, and the selected
 * space's layout on the right.
 */
export const SpacesView: React.FC = () => {
  const [query, setQuery] = useState('');
  const subview = Views.useSubview();
  const openView = Views.useOpenView();
  const spaces = Spaces.useAll();
  const selectedSpace = Spaces.use(subview?.id ?? '');
  const resolveGroupSubmenu = useEntityGroupSubmenu(SpaceGroups.constants.Type);

  // Spaces listed in the left column: fuzzy name matches in match
  // order while searching, every space by name otherwise.
  const listedSpaces = useMemo(
    () => (query ? Spaces.search(query) : [...spaces].sort(orderByName)),
    [spaces, query],
  );

  // Build the listed spaces into rows carrying their group submenu
  const items = useMemo(
    () =>
      listedSpaces.map((space) =>
        toListItem(space, resolveGroupSubmenu(space.id)),
      ),
    [listedSpaces, resolveGroupSubmenu],
  );

  // The space rendered by the panel's content
  const selectedItem = useMemo(
    () => selectedSpace && toListItem(selectedSpace),
    [selectedSpace],
  );

  // Open the selected space in a view of its own
  function handleExpandSpace() {
    openView(OpenSpaceViewEvent, {
      spaceId: selectedSpace?.id ?? '',
    });
  }

  // Open the selected space in a view of its own, in edit mode
  function handleEditSpace() {
    if (!selectedSpace) {
      return;
    }

    // Enter edit mode before opening so the view mounts editing
    setSpaceViewState(selectedSpace.id, { editing: true });

    openView(OpenSpaceViewEvent, {
      spaceId: selectedSpace.id,
    });
  }

  return (
    <ListPanelView
      icon={Spaces.constants.Icon}
      title="spaces.labels.spaces"
      items={items}
      groups={{
        type: SpaceGroups.constants.Type,
        resolveAddAction: resolveGroupAddAction,
      }}
      selectedItem={selectedItem}
      query={query}
      onQueryChange={setQuery}
      onExpandItem={handleExpandSpace}
      actions={
        selectedSpace
          ? [
              {
                icon: Designs.constants.Icon,
                label: 'spaces.view.actions.edit',
                tooltip: { title: 'spaces.view.actions.edit' },
                onClick: handleEditSpace,
              },
            ]
          : undefined
      }
      searchPlaceholder="spaces.list.searchPlaceholder"
      emptyLabel="spaces.list.empty"
      noResultsLabel="spaces.list.noResults"
      noSelectionLabel="spaces.details.noSelection"
      addAction={<NewSpaceMenu />}
    >
      {selectedSpace && <SpaceContent space={selectedSpace} />}
    </ListPanelView>
  );
};

/**
 * Returns the add control shown in a group's label row. It opens the
 * new space dialog, which files the created space under the group.
 */
function resolveGroupAddAction(group: EntityGroup): EntityGroupAddAction {
  // A space created from the ungrouped group joins no group
  const groupId =
    group.id === EntityGroups.constants.UngroupedId ? undefined : group.id;

  return {
    label: 'spaces.actions.new',
    onClick: () => Events.dispatch(OpenNewSpaceDialogEvent, { groupId }),
  };
}

/**
 * Returns the space as a list item, dragged as a selection item
 * carrying the space.
 */
function toListItem(
  space: Space,
  groupSubmenu?: SubmenuContents,
): ListPanelViewItem {
  return {
    id: space.id,
    label: space.name,
    contentIcon: space.icon,
    selectionItem: {
      id: space.id,
      type: Spaces.constants.EntityType,
      data: space,
    },
    menu: groupSubmenu
      ? [
          {
            type: 'menu-item',
            icon: SpaceGroups.constants.Icon,
            label: 'entityGroups.labels.group',
            submenu: groupSubmenu,
          },
        ]
      : undefined,
  };
}
