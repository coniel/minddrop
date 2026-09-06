import { Collections } from '@minddrop/collections';
import { DataViews } from '@minddrop/data-views';
import { Designs } from '@minddrop/designs';
import { Designs as DesignsNext } from '@minddrop/designs-next';
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
    [Designs.events.PropertyRenamed]: onRenameDesignProperty,
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
    [DataViews.events.Updated]: onUpdateVirtualView,
    [Fs.events.Changed]: onFileSystemChanged,
  });

  Events.addListeners('databases:database-views', {
    [DataViews.events.Created]: onDatabaseViewCreated,
    [DataViews.events.Updated]: onDatabaseViewUpdated,
    [DataViews.events.Deleted]: onDatabaseViewDeleted,
  });

  Events.addListeners('databases:database-designs', {
    [DesignsNext.events.Created]: onDatabaseDesignCreated,
    [DesignsNext.events.Updated]: onDatabaseDesignUpdated,
    [DesignsNext.events.Deleted]: onDatabaseDesignDeleted,
  });
}
