import { useMemo, useState } from 'react';
import { Collection, Collections } from '@minddrop/collections';
import { ListPanelView, ListPanelViewItem } from '@minddrop/ui-components';
import { IconButton } from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';
import { CollectionDetails } from './CollectionDetails';
import './CollectionsView.css';

// Icon shown for every collection until collections gain an icon field
const COLLECTION_ICON = 'content-icon:library:default';

/**
 * Renders a two column view of the persisted collections: a
 * searchable list of collections on the left, and the selected
 * collection's details on the right.
 */
export const CollectionsView: React.FC = () => {
  const [query, setQuery] = useState('');
  const subview = Views.useSubview();
  const setSubview = Views.useSetSubview();
  const collections = Collections.useAll();
  const selectedCollection = Collections.use(subview?.id ?? '');

  // Collections listed in the left column: fuzzy name matches when
  // searching, all persisted collections otherwise
  const items = useMemo(() => {
    // List only persisted collections, excluding virtual ones
    const persisted = collections.filter((collection) => !collection.virtual);

    const listed = query
      ? Collections.search(
          query,
          persisted.map((collection) => collection.id),
        )
      : persisted;

    return listed.map(toListItem);
  }, [collections, query]);

  // The collection rendered by the panel's content
  const selectedItem = useMemo(
    () => selectedCollection && toListItem(selectedCollection),
    [selectedCollection],
  );

  // Create a new collection and show it
  async function handleCreateCollection() {
    const collection = await Collections.create();

    setSubview({ id: collection.id });
  }

  return (
    <ListPanelView
      className="collections-view"
      icon="library"
      title="collections.labels.collections"
      items={items}
      selectedItem={selectedItem}
      query={query}
      onQueryChange={setQuery}
      searchPlaceholder="collections.list.searchPlaceholder"
      emptyLabel="collections.list.empty"
      noResultsLabel="collections.list.noResults"
      noSelectionLabel="collections.details.noSelection"
      addAction={
        <IconButton
          icon="plus"
          size="md"
          variant="subtle"
          label="collections.actions.new"
          onClick={handleCreateCollection}
        />
      }
    >
      {selectedCollection && (
        <CollectionDetails collection={selectedCollection} />
      )}
    </ListPanelView>
  );
};

/**
 * Returns the collection as a list item.
 */
function toListItem(collection: Collection): ListPanelViewItem {
  return {
    id: collection.id,
    label: collection.name,
    contentIcon: COLLECTION_ICON,
  };
}
