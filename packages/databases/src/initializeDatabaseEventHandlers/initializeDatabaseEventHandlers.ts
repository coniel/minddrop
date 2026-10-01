import { Collections } from '@minddrop/collections';
import { ContentViews } from '@minddrop/content-views';
import { Designs } from '@minddrop/designs-next';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import { ItemReferences } from '@minddrop/item-references';
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
  onUpdateProperty,
  onUpdateVirtualView,
} from '../event-handlers';
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
  DatabasePropertyUpdatedEvent,
  DatabaseRenamedEvent,
  DatabaseUpdatedEvent,
} from '../events';

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
    [DatabasePropertyUpdatedEvent]: onUpdateProperty,
    [DatabasePropertyRenamedEvent]: onRenameProperty,
    [DatabasePropertyOptionRenamedEvent]: onRenamePropertyOption,
    [DatabaseEntryCreatedEvent]: onCreateEntry,
    [DatabaseEntryUpdatedEvent]: onUpdateEntry,
    [DatabaseEntryWrittenEvent]: onEntryWritten,
    [DatabaseEntryDeletedEvent]: onDeleteEntry,
    [DatabaseEntriesClearedEvent]: onClearEntries,
    [DatabaseEntryRenamedEvent]: onRenameEntry,
    [DatabaseEntryMetadataUpdatedEvent]: onUpdateEntryMetadata,
    [Collections.events.Updated]: onUpdateCollection,
    [ItemReferences.events.AddressesChanged]: onItemAddressesChanged,
    [Tags.events.Renamed]: onTagRenamed,
    [Tags.events.Deleted]: onTagDeleted,
    [TagGroups.events.Deleted]: onTagGroupDeleted,
    [ContentViews.events.Updated]: onUpdateVirtualView,
    [Fs.events.Changed]: onFileSystemChanged,
  });

  Events.addListeners('databases:database-views', {
    [ContentViews.events.Created]: onDatabaseViewCreated,
    [ContentViews.events.Updated]: onDatabaseViewUpdated,
    [ContentViews.events.Deleted]: onDatabaseViewDeleted,
  });

  Events.addListeners('databases:database-designs', {
    [Designs.events.Created]: onDatabaseDesignCreated,
    [Designs.events.Updated]: onDatabaseDesignUpdated,
    [Designs.events.Deleted]: onDatabaseDesignDeleted,
  });
}
