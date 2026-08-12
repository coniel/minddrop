import React, { useEffect, useState } from 'react';
import { Collection, Collections } from '@minddrop/collections';
import { DataView, DataViews } from '@minddrop/data-views';
import {
  DatabaseEntries,
  Databases,
  OpenDatabaseEntryViewEvent,
  OpenDatabaseEntryViewEventData,
} from '@minddrop/databases';
import { Events } from '@minddrop/events';
import {
  OpenDataViewViewEvent,
  OpenDataViewViewEventData,
} from '@minddrop/feature-data-views';
import { useTranslation } from '@minddrop/i18n';
import {
  DATABASE_FALLBACK_ICON,
  DatabaseEntryContextProvider,
  SelectedEntriesToolbar,
} from '@minddrop/ui-databases';
import {
  Button,
  Checkbox,
  ContentIcon,
  Group,
  Icon,
  IconButton,
  IconPicker,
  MenuGroup,
  MenuItem,
  ScrollArea,
  Stack,
  Subheading,
  Text,
  TextInput,
} from '@minddrop/ui-primitives';
import { Views } from '@minddrop/views';
import { CollectionOptionsMenu } from './CollectionOptionsMenu';

// Icon shown for every collection until collections gain an icon field
const COLLECTION_FALLBACK_ICON = 'content-icon:library:default';

export interface CollectionDetailsProps {
  /**
   * The collection to render the details of.
   */
  collection: Collection;
}

/**
 * Renders a collection's fields, the views which use it as their
 * data source, and the entries it contains.
 */
export const CollectionDetails: React.FC<CollectionDetailsProps> = ({
  collection,
}) => {
  const [name, setName] = useState(collection.name);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const { t } = useTranslation();
  const consumers = DataViews.useDataSourceDataViews(
    'collection',
    collection.id,
  );

  // List only persisted consumers, excluding virtual views
  const persistedConsumers = consumers.filter((consumer) => !consumer.virtual);

  // Ignore selected items which are no longer part of the collection
  const selectedItems = selectedItemIds.filter((itemId) =>
    collection.items.includes(itemId),
  );

  // Selection states driving the select all checkbox
  const allItemsSelected =
    collection.items.length > 0 &&
    selectedItems.length === collection.items.length;
  const someItemsSelected = !allItemsSelected && selectedItems.length > 0;

  // Resync the name field when a different collection is shown, or
  // when the name is changed elsewhere
  useEffect(() => {
    setName(collection.name);
  }, [collection.id, collection.name]);

  // Clear the selection when a different collection is shown
  useEffect(() => {
    setSelectedItemIds([]);
  }, [collection.id]);

  // Persist the edited name, reverting to the current name when blank
  function handleCommitName() {
    const editedName = name.trim();

    // Restore the current name rather than persisting a blank one
    if (!editedName) {
      setName(collection.name);

      return;
    }

    // The name is unchanged
    if (editedName === collection.name) {
      return;
    }

    Collections.update(collection.id, { name: editedName });
  }

  // Commit the name on Enter by blurring the field
  function handleNameKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
  }

  // Select or deselect all of the collection's entries
  function handleSelectAllItems(selected: boolean) {
    setSelectedItemIds(selected ? [...collection.items] : []);
  }

  // Add or remove an entry from the selection
  function handleSelectItem(itemId: string, selected: boolean) {
    setSelectedItemIds((currentIds) => {
      // Deselecting, drop the entry from the selection
      if (!selected) {
        return currentIds.filter((currentId) => currentId !== itemId);
      }

      return [...currentIds, itemId];
    });
  }

  // Clear the entry selection
  function handleClearSelection() {
    setSelectedItemIds([]);
  }

  // Open the clicked consumer's view
  function handleOpenConsumer(dataViewId: string) {
    Events.dispatch<OpenDataViewViewEventData>(OpenDataViewViewEvent, {
      dataViewId,
    });
  }

  // Render a consumer as a button which opens its view
  function renderConsumer(consumer: DataView) {
    return (
      <Button
        size="sm"
        variant="subtle"
        key={consumer.id}
        startIcon={<ContentIcon icon={consumer.icon} />}
        onClick={() => handleOpenConsumer(consumer.id)}
      >
        {consumer.name}
      </Button>
    );
  }

  return (
    /* Entry actions are sourced from the collection */
    <DatabaseEntryContextProvider
      source={{ type: 'collection', id: collection.id }}
    >
      <div className="collection-details">
        <ScrollArea className="collection-details-scroll">
          <Stack gap={5} className="collection-details-content">
            {/* The collection's fields */}
            <Group gap={2} className="collection-details-fields">
              {/* Selection is a no-op until collections have an icon field */}
              <IconPicker closeOnSelect currentIcon={COLLECTION_FALLBACK_ICON}>
                <IconButton
                  size="lg"
                  variant="subtle"
                  color="neutral"
                  label="collections.details.icon"
                >
                  <ContentIcon icon={COLLECTION_FALLBACK_ICON} />
                </IconButton>
              </IconPicker>
              <TextInput
                variant="subtle"
                size="lg"
                className="collection-details-name"
                value={name}
                onValueChange={setName}
                onBlur={handleCommitName}
                onKeyDown={handleNameKeyDown}
              />
              <CollectionOptionsMenu collection={collection} />
            </Group>

            {/* The views which use the collection as their data source */}
            <Stack gap={2}>
              <Group gap={2}>
                <Icon
                  name="link"
                  color="muted"
                  className="collection-details-section-icon"
                />
                <Subheading
                  noMargin
                  size="sm"
                  text="collections.details.consumers"
                />
              </Group>
              {persistedConsumers.length > 0 ? (
                <Group wrap gap={2}>
                  {persistedConsumers.map(renderConsumer)}
                </Group>
              ) : (
                <Text
                  block
                  size="sm"
                  color="muted"
                  text="collections.details.consumersEmpty"
                />
              )}
            </Stack>

            {/* The entries the collection contains */}
            <Stack gap={2}>
              {/* Select all checkbox and the section label */}
              <Group gap={2}>
                {collection.items.length > 0 && (
                  <Checkbox
                    checked={allItemsSelected}
                    indeterminate={someItemsSelected}
                    aria-label={t('collections.details.selectAllEntries')}
                    onCheckedChange={handleSelectAllItems}
                  />
                )}
                <Subheading
                  noMargin
                  size="sm"
                  text="collections.details.entries"
                />
              </Group>
              {collection.items.length > 0 ? (
                <MenuGroup>
                  {collection.items.map((itemId) => (
                    <CollectionItem
                      key={itemId}
                      itemId={itemId}
                      selected={selectedItems.includes(itemId)}
                      onSelectedChange={handleSelectItem}
                    />
                  ))}
                </MenuGroup>
              ) : (
                <Text
                  block
                  size="sm"
                  color="muted"
                  text="collections.details.entriesEmpty"
                />
              )}
            </Stack>
          </Stack>
        </ScrollArea>

        {/* Actions applied to the selected entries */}
        <SelectedEntriesToolbar
          entryIds={selectedItems}
          onClearSelection={handleClearSelection}
        />
      </div>
    </DatabaseEntryContextProvider>
  );
};

interface CollectionItemProps {
  /**
   * The ID of the collection item's database entry.
   */
  itemId: string;

  /**
   * Whether the item is selected.
   */
  selected: boolean;

  /**
   * Callback fired when the item's selected state changes.
   */
  onSelectedChange: (itemId: string, selected: boolean) => void;
}

/**
 * Renders a collection item as a selectable row labelled with its
 * database entry's title, icon'd by the database it belongs to, which
 * opens the entry when clicked. Renders nothing when the entry no
 * longer exists.
 */
const CollectionItem: React.FC<CollectionItemProps> = ({
  itemId,
  selected,
  onSelectedChange,
}) => {
  const { t } = useTranslation();
  const entry = DatabaseEntries.use(itemId);
  const openView = Views.useOpenView();

  // Open the entry, using its database's configured open mode
  function handleOpenEntry() {
    openView<OpenDatabaseEntryViewEventData>(OpenDatabaseEntryViewEvent, {
      entryId: itemId,
    });
  }

  // Toggle the item's selected state
  function handleSelectedChange(checked: boolean) {
    onSelectedChange(itemId, checked);
  }

  // The entry is missing from the store
  if (!entry) {
    return null;
  }

  // The database the entry belongs to, providing the row icon
  const database = Databases.get(entry.database, false);

  return (
    <Group gap={2} className="collection-details-entry">
      <Checkbox
        checked={selected}
        aria-label={t('collections.details.selectEntry')}
        onCheckedChange={handleSelectedChange}
      />
      <MenuItem
        muted
        size="compact"
        className="collection-details-entry-item"
        stringLabel={entry.title}
        contentIcon={database?.icon || DATABASE_FALLBACK_ICON}
        onClick={handleOpenEntry}
      />
    </Group>
  );
};
