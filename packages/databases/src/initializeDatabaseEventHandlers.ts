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
  onEntryWritten,
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
  DatabaseEntryWrittenEvent,
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
    [DatabaseCreatedEvent]: onCreateDatabase,
    [DatabaseUpdatedEvent]: onUpdateDatabase,
    [DatabaseDeletedEvent]: onDeleteDatabase,
    [DatabaseRenamedEvent]: onRenameDatabase,
    [DatabasePropertyAddedEvent]: onAddProperty,
    [DatabasePropertyRemovedEvent]: onRemoveProperty,
    [DatabasePropertyRenamedEvent]: onRenameProperty,
    [DesignPropertyRenamedEvent]: onRenameDesignProperty,
    [DatabaseEntryCreatedEvent]: onCreateEntry,
    [DatabaseEntryUpdatedEvent]: onUpdateEntry,
    [DatabaseEntryWrittenEvent]: onEntryWritten,
    [DatabaseEntryDeletedEvent]: onDeleteEntry,
    [DatabaseEntriesClearedEvent]: onClearEntries,
    [DatabaseEntryRenamedEvent]: onRenameEntry,
    [DatabaseEntryMetadataUpdatedEvent]: onUpdateEntryMetadata,
    [CollectionUpdatedEvent]: onUpdateCollection,
    [ItemAddressesChangedEvent]: onItemAddressesChanged,
    [TagRenamedEvent]: onTagRenamed,
    [TagDeletedEvent]: onTagDeleted,
    [TagGroupDeletedEvent]: onTagGroupDeleted,
    [DataViewUpdatedEvent]: onUpdateVirtualView,
    [FileSystemChangedEvent]: onFileSystemChanged,
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
