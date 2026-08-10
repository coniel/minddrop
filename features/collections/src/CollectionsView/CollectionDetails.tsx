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
import { DATABASE_FALLBACK_ICON } from '@minddrop/ui-databases';
import {
  Button,
  ContentIcon,
  Group,
  IconButton,
  IconPicker,
  MenuGroup,
  MenuItem,
  Stack,
  Subheading,
  Text,
  TextInput,
} from '@minddrop/ui-primitives';
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
  const consumers = DataViews.useDataSourceDataViews(
    'collection',
    collection.id,
  );

  // List only persisted consumers, excluding virtual views
  const persistedConsumers = consumers.filter((consumer) => !consumer.virtual);

  // Resync the name field when a different collection is shown, or
  // when the name is changed elsewhere
  useEffect(() => {
    setName(collection.name);
  }, [collection.id, collection.name]);

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
    <Stack gap={5} className="collection-details">
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
        <Subheading noMargin size="sm" text="collections.details.consumers" />
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
        <Subheading noMargin size="sm" text="collections.details.entries" />
        {collection.items.length > 0 ? (
          <MenuGroup>
            {collection.items.map((itemId) => (
              <CollectionItem key={itemId} itemId={itemId} />
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
  );
};

interface CollectionItemProps {
  /**
   * The ID of the collection item's database entry.
   */
  itemId: string;
}

/**
 * Renders a collection item as a row labelled with its database
 * entry's title, icon'd by the database it belongs to, which opens
 * the entry when clicked. Renders nothing when the entry no longer
 * exists.
 */
const CollectionItem: React.FC<CollectionItemProps> = ({ itemId }) => {
  const entry = DatabaseEntries.use(itemId);

  // Open the entry, using its database's configured open mode
  function handleOpenEntry() {
    Events.dispatch<OpenDatabaseEntryViewEventData>(
      OpenDatabaseEntryViewEvent,
      { entryId: itemId },
    );
  }

  // The entry is missing from the store
  if (!entry) {
    return null;
  }

  // The database the entry belongs to, providing the row icon
  const database = Databases.get(entry.database, false);

  return (
    <MenuItem
      muted
      size="compact"
      stringLabel={entry.title}
      contentIcon={database?.icon || DATABASE_FALLBACK_ICON}
      onClick={handleOpenEntry}
    />
  );
};
