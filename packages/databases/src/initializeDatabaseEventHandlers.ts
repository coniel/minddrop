import {
  CollectionUpdatedEvent,
  CollectionUpdatedEventData,
} from '@minddrop/collections';
import {
  DesignPropertyRenamedEvent,
  DesignPropertyRenamedEventData,
} from '@minddrop/designs';
import { Events } from '@minddrop/events';
import {
  ItemAddressesChangedEvent,
  ItemAddressesChangedEventData,
} from '@minddrop/item-references';
import {
  ViewCreatedEvent,
  ViewCreatedEventData,
  ViewDeletedEvent,
  ViewDeletedEventData,
  ViewUpdatedEvent,
  ViewUpdatedEventData,
} from '@minddrop/views';
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
  onItemAddressesChanged,
  onRemoveProperty,
  onRenameDatabase,
  onRenameDesignProperty,
  onRenameEntry,
  onRenameProperty,
  onUpdateCollection,
  onUpdateDatabase,
  onUpdateEntry,
  onUpdateEntryMetadata,
  onUpdateVirtualView,
} from './event-handlers';
import {
  DatabaseCreatedEvent,
  DatabaseCreatedEventData,
  DatabaseDeletedEvent,
  DatabaseDeletedEventData,
  DatabaseEntriesClearedEvent,
  DatabaseEntriesClearedEventData,
  DatabaseEntryCreatedEvent,
  DatabaseEntryCreatedEventData,
  DatabaseEntryDeletedEvent,
  DatabaseEntryDeletedEventData,
  DatabaseEntryMetadataUpdatedEvent,
  DatabaseEntryMetadataUpdatedEventData,
  DatabaseEntryRenamedEvent,
  DatabaseEntryRenamedEventData,
  DatabaseEntryUpdatedEvent,
  DatabaseEntryUpdatedEventData,
  DatabasePropertyAddedEvent,
  DatabasePropertyAddedEventData,
  DatabasePropertyRemovedEvent,
  DatabasePropertyRemovedEventData,
  DatabasePropertyRenamedEvent,
  DatabasePropertyRenamedEventData,
  DatabaseRenamedEvent,
  DatabaseRenamedEventData,
  DatabaseUpdatedEvent,
  DatabaseUpdatedEventData,
} from './events';

/**
 * Registers event handlers for database and entry
 * lifecycle events.
 */
export function initializeDatabaseEventHandlers() {
  Events.on<DatabaseCreatedEventData>(
    DatabaseCreatedEvent,
    'databases',
    ({ data }) => {
      onCreateDatabase(data);
    },
  );

  Events.on<DatabaseUpdatedEventData>(
    DatabaseUpdatedEvent,
    'databases',
    ({ data }) => {
      onUpdateDatabase(data);
    },
  );

  Events.on<DatabaseDeletedEventData>(
    DatabaseDeletedEvent,
    'databases',
    ({ data }) => {
      onDeleteDatabase(data);
    },
  );

  Events.on<DatabaseRenamedEventData>(
    DatabaseRenamedEvent,
    'databases',
    ({ data }) => {
      onRenameDatabase(data);
    },
  );

  Events.on<DatabasePropertyAddedEventData>(
    DatabasePropertyAddedEvent,
    'databases',
    ({ data }) => {
      onAddProperty(data);
    },
  );

  Events.on<DatabasePropertyRemovedEventData>(
    DatabasePropertyRemovedEvent,
    'databases',
    ({ data }) => {
      onRemoveProperty(data);
    },
  );

  Events.on<DatabasePropertyRenamedEventData>(
    DatabasePropertyRenamedEvent,
    'databases',
    ({ data }) => {
      onRenameProperty(data);
    },
  );

  Events.on<DesignPropertyRenamedEventData>(
    DesignPropertyRenamedEvent,
    'databases',
    ({ data }) => {
      onRenameDesignProperty(data);
    },
  );

  Events.on<DatabaseEntryCreatedEventData>(
    DatabaseEntryCreatedEvent,
    'databases',
    ({ data }) => {
      onCreateEntry(data);
    },
  );

  Events.on<DatabaseEntryUpdatedEventData>(
    DatabaseEntryUpdatedEvent,
    'databases',
    ({ data }) => {
      onUpdateEntry(data);
    },
  );

  Events.on<DatabaseEntryDeletedEventData>(
    DatabaseEntryDeletedEvent,
    'databases',
    ({ data }) => {
      onDeleteEntry(data);
    },
  );

  Events.on<DatabaseEntriesClearedEventData>(
    DatabaseEntriesClearedEvent,
    'databases',
    ({ data }) => {
      onClearEntries(data);
    },
  );

  Events.on<DatabaseEntryRenamedEventData>(
    DatabaseEntryRenamedEvent,
    'databases',
    ({ data }) => {
      onRenameEntry(data);
    },
  );

  Events.on<DatabaseEntryMetadataUpdatedEventData>(
    DatabaseEntryMetadataUpdatedEvent,
    'databases',
    ({ data }) => {
      onUpdateEntryMetadata(data);
    },
  );

  Events.on<CollectionUpdatedEventData>(
    CollectionUpdatedEvent,
    'databases',
    ({ data }) => onUpdateCollection(data),
  );

  Events.on<ItemAddressesChangedEventData>(
    ItemAddressesChangedEvent,
    'databases',
    ({ data }) => onItemAddressesChanged(data),
  );

  Events.on<ViewUpdatedEventData>(ViewUpdatedEvent, 'databases', ({ data }) => {
    onUpdateVirtualView(data);
  });

  Events.on<ViewCreatedEventData>(
    ViewCreatedEvent,
    'databases:database-views',
    ({ data }) => {
      onDatabaseViewCreated(data);
    },
  );

  Events.on<ViewUpdatedEventData>(
    ViewUpdatedEvent,
    'databases:database-views',
    ({ data }) => {
      onDatabaseViewUpdated(data);
    },
  );

  Events.on<ViewDeletedEventData>(
    ViewDeletedEvent,
    'databases:database-views',
    ({ data }) => {
      onDatabaseViewDeleted(data);
    },
  );
}
