import { CollectionUpdatedEvent } from '@minddrop/collections';
import {
  DataViewCreatedEvent,
  DataViewDeletedEvent,
  DataViewUpdatedEvent,
} from '@minddrop/data-views';
import { DesignPropertyRenamedEvent } from '@minddrop/designs';
import { Events } from '@minddrop/events';
import { FileSystemChangedEvent } from '@minddrop/file-system';
import { ItemAddressesChangedEvent } from '@minddrop/item-references';
import { TagDeletedEvent, TagRenamedEvent } from '@minddrop/tags';
import {
  onAddProperty,
  onClearEntries,
  onCreateDatabase,
  onCreateEntry,
  onDatabaseViewCreated,
  onDatabaseViewDeleted,
  onDatabaseViewUpdated,
  onDeleteDatabase,
  onDeleteEntry,
  onFileSystemChanged,
  onItemAddressesChanged,
  onRemoveProperty,
  onRenameDatabase,
  onRenameDesignProperty,
  onRenameEntry,
  onRenameProperty,
  onTagDeleted,
  onTagRenamed,
  onUpdateCollection,
  onUpdateDatabase,
  onUpdateEntry,
  onUpdateEntryMetadata,
  onUpdateVirtualView,
} from './event-handlers';
import {
  DatabaseCreatedEvent,
  DatabaseDeletedEvent,
  DatabaseEntriesClearedEvent,
  DatabaseEntryCreatedEvent,
  DatabaseEntryDeletedEvent,
  DatabaseEntryMetadataUpdatedEvent,
  DatabaseEntryRenamedEvent,
  DatabaseEntryUpdatedEvent,
  DatabasePropertyAddedEvent,
  DatabasePropertyRemovedEvent,
  DatabasePropertyRenamedEvent,
  DatabaseRenamedEvent,
  DatabaseUpdatedEvent,
} from './events';

/**
 * Registers event handlers for database and entry
 * lifecycle events.
 */
export function initializeDatabaseEventHandlers() {
  Events.on(DatabaseCreatedEvent, 'databases', ({ data }) => {
    onCreateDatabase(data);
  });

  Events.on(DatabaseUpdatedEvent, 'databases', ({ data }) => {
    onUpdateDatabase(data);
  });

  Events.on(DatabaseDeletedEvent, 'databases', ({ data }) => {
    onDeleteDatabase(data);
  });

  Events.on(DatabaseRenamedEvent, 'databases', ({ data }) => {
    onRenameDatabase(data);
  });

  Events.on(DatabasePropertyAddedEvent, 'databases', ({ data }) => {
    onAddProperty(data);
  });

  Events.on(DatabasePropertyRemovedEvent, 'databases', ({ data }) => {
    onRemoveProperty(data);
  });

  Events.on(DatabasePropertyRenamedEvent, 'databases', ({ data }) => {
    onRenameProperty(data);
  });

  Events.on(DesignPropertyRenamedEvent, 'databases', ({ data }) => {
    onRenameDesignProperty(data);
  });

  Events.on(DatabaseEntryCreatedEvent, 'databases', ({ data }) => {
    onCreateEntry(data);
  });

  Events.on(DatabaseEntryUpdatedEvent, 'databases', ({ data }) => {
    onUpdateEntry(data);
  });

  Events.on(DatabaseEntryDeletedEvent, 'databases', ({ data }) => {
    onDeleteEntry(data);
  });

  Events.on(DatabaseEntriesClearedEvent, 'databases', ({ data }) => {
    onClearEntries(data);
  });

  Events.on(DatabaseEntryRenamedEvent, 'databases', ({ data }) => {
    onRenameEntry(data);
  });

  Events.on(DatabaseEntryMetadataUpdatedEvent, 'databases', ({ data }) => {
    onUpdateEntryMetadata(data);
  });

  Events.on(CollectionUpdatedEvent, 'databases', ({ data }) =>
    onUpdateCollection(data),
  );

  Events.on(ItemAddressesChangedEvent, 'databases', ({ data }) =>
    onItemAddressesChanged(data),
  );

  Events.on(TagRenamedEvent, 'databases', ({ data }) => onTagRenamed(data));

  Events.on(TagDeletedEvent, 'databases', ({ data }) => onTagDeleted(data));

  Events.on(DataViewUpdatedEvent, 'databases', ({ data }) => {
    onUpdateVirtualView(data);
  });

  Events.on(FileSystemChangedEvent, 'databases', ({ data }) =>
    onFileSystemChanged(data),
  );

  Events.on(DataViewCreatedEvent, 'databases:database-views', ({ data }) => {
    onDatabaseViewCreated(data);
  });

  Events.on(DataViewUpdatedEvent, 'databases:database-views', ({ data }) => {
    onDatabaseViewUpdated(data);
  });

  Events.on(DataViewDeletedEvent, 'databases:database-views', ({ data }) => {
    onDatabaseViewDeleted(data);
  });
}
