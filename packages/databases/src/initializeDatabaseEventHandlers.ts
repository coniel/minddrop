import { CollectionUpdatedEvent } from '@minddrop/collections';
import {
  DataViewCreatedEvent,
  DataViewDeletedEvent,
  DataViewUpdatedEvent,
} from '@minddrop/data-views';
import { DesignPropertyRenamedEvent } from '@minddrop/designs';
import {
  DesignCreatedEvent,
  DesignDeletedEvent,
  DesignUpdatedEvent,
} from '@minddrop/designs-next';
import { Events } from '@minddrop/events';
import { FileSystemChangedEvent } from '@minddrop/file-system';
import { ItemAddressesChangedEvent } from '@minddrop/item-references';
import {
  TagDeletedEvent,
  TagGroupDeletedEvent,
  TagRenamedEvent,
} from '@minddrop/tags';
import {
  onAddProperty,
  onClearEntries,
  onCreateDatabase,
  onCreateEntry,
  onDatabaseDesignCreated,
  onDatabaseDesignDeleted,
  onDatabaseDesignUpdated,
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
  onTagGroupDeleted,
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
  Events.addListeners('databases', {
    [DatabaseCreatedEvent]: ({ data }) => onCreateDatabase(data),
    [DatabaseUpdatedEvent]: ({ data }) => onUpdateDatabase(data),
    [DatabaseDeletedEvent]: ({ data }) => onDeleteDatabase(data),
    [DatabaseRenamedEvent]: ({ data }) => onRenameDatabase(data),
    [DatabasePropertyAddedEvent]: ({ data }) => onAddProperty(data),
    [DatabasePropertyRemovedEvent]: ({ data }) => onRemoveProperty(data),
    [DatabasePropertyRenamedEvent]: ({ data }) => onRenameProperty(data),
    [DesignPropertyRenamedEvent]: ({ data }) => onRenameDesignProperty(data),
    [DatabaseEntryCreatedEvent]: ({ data }) => onCreateEntry(data),
    [DatabaseEntryUpdatedEvent]: ({ data }) => onUpdateEntry(data),
    [DatabaseEntryDeletedEvent]: ({ data }) => onDeleteEntry(data),
    [DatabaseEntriesClearedEvent]: ({ data }) => onClearEntries(data),
    [DatabaseEntryRenamedEvent]: ({ data }) => onRenameEntry(data),
    [DatabaseEntryMetadataUpdatedEvent]: ({ data }) =>
      onUpdateEntryMetadata(data),
    [CollectionUpdatedEvent]: ({ data }) => onUpdateCollection(data),
    [ItemAddressesChangedEvent]: ({ data }) => onItemAddressesChanged(data),
    [TagRenamedEvent]: ({ data }) => onTagRenamed(data),
    [TagDeletedEvent]: ({ data }) => onTagDeleted(data),
    [TagGroupDeletedEvent]: ({ data }) => onTagGroupDeleted(data),
    [DataViewUpdatedEvent]: ({ data }) => onUpdateVirtualView(data),
    [FileSystemChangedEvent]: ({ data }) => onFileSystemChanged(data),
  });

  Events.addListeners('databases:database-views', {
    [DataViewCreatedEvent]: ({ data }) => onDatabaseViewCreated(data),
    [DataViewUpdatedEvent]: ({ data }) => onDatabaseViewUpdated(data),
    [DataViewDeletedEvent]: ({ data }) => onDatabaseViewDeleted(data),
  });

  Events.addListeners('databases:database-designs', {
    [DesignCreatedEvent]: ({ data }) => onDatabaseDesignCreated(data),
    [DesignUpdatedEvent]: ({ data }) => onDatabaseDesignUpdated(data),
    [DesignDeletedEvent]: ({ data }) => onDatabaseDesignDeleted(data),
  });
}
