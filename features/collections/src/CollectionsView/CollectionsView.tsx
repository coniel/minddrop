import { useMemo, useState } from 'react';
import {
  Collection,
  CollectionGroups,
  Collections,
} from '@minddrop/collections';
import { EntityGroup, EntityGroups } from '@minddrop/entity-groups';
import { ListPanelView, ListPanelViewItem } from '@minddrop/ui-components';
import {
  EntityGroupAddAction,
  useEntityGroupSubmenu,
} from '@minddrop/ui-entity-groups';
import { SubmenuContents } from '@minddrop/ui-primitives';
import { orderByName } from '@minddrop/utils';
import { Views } from '@minddrop/views';
import { CollectionDetails } from './CollectionDetails';
import { NewCollectionMenu } from './NewCollectionMenu';
import './CollectionsView.css';

/**
 * Renders a two column view of the persisted collections: a
 * searchable list of collections grouped by collection group on the
 * left, and the selected collection's details on the right.
 */
export const CollectionsView: React.FC = () => {
  const [query, setQuery] = useState('');
  const subview = Views.useSubview();
  const setSubview = Views.useSetSubview();
  const collections = Collections.useAll();
  const selectedCollection = Collections.use(subview?.id ?? '');
  const resolveGroupSubmenu = useEntityGroupSubmenu(
    CollectionGroups.constants.Type,
  );

  // Collections listed in the left column: fuzzy name matches in
  // match order while searching, every persisted collection by name
  // otherwise. Virtual collections belong to their owner, so they
  // are left out.
  const listedCollections = useMemo(() => {
    const persisted = collections.filter((collection) => !collection.virtual);

    if (query) {
      return Collections.search(
        query,
        persisted.map((collection) => collection.id),
      );
    }

    return [...persisted].sort(orderByName);
  }, [collections, query]);

  // Build the listed collections into rows carrying their group
  // submenu.
  const items = useMemo(
    () =>
      listedCollections.map((collection) =>
        toListItem(collection, resolveGroupSubmenu(collection.id)),
      ),
    [listedCollections, resolveGroupSubmenu],
  );

  // The collection rendered by the panel's content
  const selectedItem = useMemo(
    () => selectedCollection && toListItem(selectedCollection),
    [selectedCollection],
  );

  // Create a collection filed under the group it was created from
  // and show it. The ungrouped group files it under none.
  async function handleCreateCollection(groupId?: string) {
    const collection = await Collections.create();

    if (groupId) {
      await CollectionGroups.addItem(groupId, collection.id);
    }

    setSubview({ id: collection.id });
  }

  // Returns the add control shown in a group's label row, which
  // creates a collection filed under the group.
  function resolveGroupAddAction(group: EntityGroup): EntityGroupAddAction {
    // A collection created from the ungrouped group joins no group
    const groupId =
      group.id === EntityGroups.constants.UngroupedId ? undefined : group.id;

    return {
      label: 'collections.actions.new',
      onClick: () => handleCreateCollection(groupId),
    };
  }

  return (
    <ListPanelView
      className="collections-view"
      icon={Collections.constants.Icon}
      title="collections.labels.collections"
      items={items}
      groups={{
        type: CollectionGroups.constants.Type,
        resolveAddAction: resolveGroupAddAction,
      }}
      selectedItem={selectedItem}
      query={query}
      onQueryChange={setQuery}
      searchPlaceholder="collections.list.searchPlaceholder"
      emptyLabel="collections.list.empty"
      noResultsLabel="collections.list.noResults"
      noSelectionLabel="collections.details.noSelection"
      addAction={<NewCollectionMenu />}
    >
      {selectedCollection && (
        <CollectionDetails collection={selectedCollection} />
      )}
    </ListPanelView>
  );
};

/**
 * Returns the collection as a list item carrying its group submenu.
 */
function toListItem(
  collection: Collection,
  groupSubmenu?: SubmenuContents,
): ListPanelViewItem {
  return {
    id: collection.id,
    label: collection.name,
    contentIcon: Collections.constants.EntityDefaultIcon,
    menu: groupSubmenu
      ? [
          {
            type: 'menu-item',
            icon: CollectionGroups.constants.Icon,
            label: 'entityGroups.labels.group',
            submenu: groupSubmenu,
          },
        ]
      : undefined,
  };
}
