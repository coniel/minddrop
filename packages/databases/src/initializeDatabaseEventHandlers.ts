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
import { Collections } from '@minddrop/collections';
import { Events } from '@minddrop/events';
import { ItemAddressesChangedEvent } from '@minddrop/item-references';
import {
import { Fs } from '@minddrop/file-system';
import { TagGroups, Tags } from '@minddrop/tags';
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
  onEntryWritten,
  onFileSystemChanged,
  onItemAddressesChanged,
  onRemoveProperty,
  onRenameDatabase,
  onRenameDesignProperty,
  onRenameEntry,
  onRenameProperty,
  onRenamePropertyOption,
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
  DatabaseEntryWrittenEvent,
  DatabasePropertyAddedEvent,
  DatabasePropertyOptionRenamedEvent,
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
    [DatabaseCreatedEvent]: onCreateDatabase,
    [DatabaseUpdatedEvent]: onUpdateDatabase,
    [DatabaseDeletedEvent]: onDeleteDatabase,
    [DatabaseRenamedEvent]: onRenameDatabase,
    [DatabasePropertyAddedEvent]: onAddProperty,
    [DatabasePropertyRemovedEvent]: onRemoveProperty,
    [DatabasePropertyRenamedEvent]: onRenameProperty,
    [DatabasePropertyOptionRenamedEvent]: onRenamePropertyOption,
    [DesignPropertyRenamedEvent]: onRenameDesignProperty,
    [DatabaseEntryCreatedEvent]: onCreateEntry,
    [DatabaseEntryUpdatedEvent]: onUpdateEntry,
    [DatabaseEntryWrittenEvent]: onEntryWritten,
    [DatabaseEntryDeletedEvent]: onDeleteEntry,
    [DatabaseEntriesClearedEvent]: onClearEntries,
    [DatabaseEntryRenamedEvent]: onRenameEntry,
    [DatabaseEntryMetadataUpdatedEvent]: onUpdateEntryMetadata,
    [ItemAddressesChangedEvent]: onItemAddressesChanged,
    [DataViewUpdatedEvent]: onUpdateVirtualView,
    [Collections.events.Updated]: onUpdateCollection,
    [Tags.events.Renamed]: onTagRenamed,
    [Tags.events.Deleted]: onTagDeleted,
    [TagGroups.events.Deleted]: onTagGroupDeleted,
    [Fs.events.Changed]: onFileSystemChanged,
  });

  Events.addListeners('databases:database-views', {
    [DataViewCreatedEvent]: onDatabaseViewCreated,
    [DataViewUpdatedEvent]: onDatabaseViewUpdated,
    [DataViewDeletedEvent]: onDatabaseViewDeleted,
  });

  Events.addListeners('databases:database-designs', {
    [DesignCreatedEvent]: onDatabaseDesignCreated,
    [DesignUpdatedEvent]: onDatabaseDesignUpdated,
    [DesignDeletedEvent]: onDatabaseDesignDeleted,
  });
}
