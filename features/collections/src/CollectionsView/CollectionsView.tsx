import { useEffect, useState } from 'react';
import { Collections } from '@minddrop/collections';
import { PanelView } from '@minddrop/ui-components';
import {
  Group,
  Icon,
  IconButton,
  MenuGroup,
  MenuItem,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from '@minddrop/ui-primitives';
import { CollectionDetails } from './CollectionDetails';
import './CollectionsView.css';

/**
 * Renders a two column view of the persisted collections: a
 * searchable list of collections on the left, and the selected
 * collection's details on the right.
 */
export const CollectionsView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const collections = Collections.useAll();
  const selectedCollection = Collections.use(selectedCollectionId);

  // List only persisted collections, excluding virtual ones
  const persistedCollections = collections.filter(
    (collection) => !collection.virtual,
  );

  // Collections listed in the left column: fuzzy name matches
  // when searching, all persisted collections otherwise
  const listedCollections = query
    ? Collections.search(
        query,
        persistedCollections.map((collection) => collection.id),
      )
    : persistedCollections;

  // The collection selected by default, also used as the fallback
  // when the selected collection is deleted
  const firstCollectionId = persistedCollections[0]?.id;

  // Select the first collection when nothing is selected
  useEffect(() => {
    if (!selectedCollection && firstCollectionId) {
      setSelectedCollectionId(firstCollectionId);
    }
  }, [selectedCollection, firstCollectionId]);

  // Create a new collection and select it
  async function handleCreateCollection() {
    const collection = await Collections.create();

    setSelectedCollectionId(collection.id);
  }

  return (
    <PanelView
      className="collections-view"
      icon="library"
      title="collections.labels.collections"
    >
      <Group align="stretch" className="collections-view-content">
        {/* The list of collections */}
        <Stack className="collections-view-list">
          {/* Search field and new collection button */}
          <Group gap={1} className="collections-view-list-header">
            <TextInput
              clearable
              size="sm"
              variant="subtle"
              className="collections-view-search"
              placeholder="collections.list.searchPlaceholder"
              value={query}
              leading={<Icon name="search" color="muted" />}
              onValueChange={setQuery}
            />
            <IconButton
              icon="plus"
              size="sm"
              variant="subtle"
              label="collections.actions.new"
              onClick={handleCreateCollection}
            />
          </Group>

          <ScrollArea className="collections-view-list-items">
            <MenuGroup>
              {listedCollections.map((collection) => (
                <MenuItem
                  muted
                  size="compact"
                  icon="library"
                  key={collection.id}
                  stringLabel={collection.name}
                  active={collection.id === selectedCollectionId}
                  onClick={() => setSelectedCollectionId(collection.id)}
                />
              ))}
            </MenuGroup>
            {/* Empty state, differentiating no matches from no collections */}
            {listedCollections.length === 0 && (
              <Text
                block
                size="sm"
                color="muted"
                className="collections-view-empty"
                text={
                  query
                    ? 'collections.list.noResults'
                    : 'collections.list.empty'
                }
              />
            )}
          </ScrollArea>
        </Stack>

        {/* The selected collection's details */}
        <div className="collections-view-details">
          {selectedCollection ? (
            <CollectionDetails collection={selectedCollection} />
          ) : (
            /* Empty state shown until a collection is selected */
            <Text
              block
              size="sm"
              color="muted"
              className="collections-view-empty"
              text="collections.details.noSelection"
            />
          )}
        </div>
      </Group>
    </PanelView>
  );
};
