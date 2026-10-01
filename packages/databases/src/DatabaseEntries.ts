import { DatabaseEntryEntityType, EntryTransferDataTypes } from './constants';
import { DatabaseEntryNotFoundError } from './errors';
import {
  DatabaseEntriesClearedEvent,
  DatabaseEntryCreatedEvent,
  DatabaseEntryDeletedEvent,
  DatabaseEntryDuplicatedEvent,
  DatabaseEntryRenamedEvent,
  DatabaseEntryUpdatedEvent,
  DatabaseEntryWrittenEvent,
  OpenDatabaseEntryViewEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Created: DatabaseEntryCreatedEvent,
  Updated: DatabaseEntryUpdatedEvent,
  Deleted: DatabaseEntryDeletedEvent,
  Renamed: DatabaseEntryRenamedEvent,
  Written: DatabaseEntryWrittenEvent,
  Duplicated: DatabaseEntryDuplicatedEvent,
  Cleared: DatabaseEntriesClearedEvent,
  OpenView: OpenDatabaseEntryViewEvent,
} as const;

export const constants = {
  EntityType: DatabaseEntryEntityType,
  TransferDataTypes: EntryTransferDataTypes,
};

export const errors = {
  NotFound: DatabaseEntryNotFoundError,
};

export { createDatabaseEntry as create } from './createDatabaseEntry';
export { deleteDatabaseEntry as delete } from './deleteDatabaseEntry';
export { duplicateDatabaseEntry as duplicate } from './duplicateDatabaseEntry';
export { createDatabaseEntryFromFilePath as createFromFilePath } from './createDatabaseEntryFromFilePath';
export { createDatabaseEntryFromFile as createFromFile } from './createDatabaseEntryFromFile';
export { createDatabaseEntryFromUrl as createFromUrl } from './createDatabaseEntryFromUrl';
export { createDatabaseEntriesFromTransferData as createFromTransferData } from './createDatabaseEntriesFromTransferData';
export { createDatabaseEntryFromTemplate as createFromTemplate } from './createDatabaseEntryFromTemplate';
export { getDatabaseEntry as get } from './getDatabaseEntry';
export { renameDatabaseEntry as rename } from './renameDatabaseEntry';
export { updateDatabaseEntry as update } from './updateDatabaseEntry';
export { clearDatabaseEntryProperty as clearProperty } from './clearDatabaseEntryProperty';
export { updateDatabaseEntryProperty as updateProperty } from './updateDatabaseEntryProperty';
export { setEntryColor as setColor } from './setEntryColor';
export { getEntryPropertyMetadata as getPropertyMetadata } from './getEntryPropertyMetadata';
export { updateEntryPropertyMetadata as updatePropertyMetadata } from './updateEntryPropertyMetadata';
export { writeDatabaseEntry as write } from './writeDatabaseEntry';
export { readDatabaseEntry as read } from './readDatabaseEntry';
export {
  DatabaseEntriesStore as Store,
  useDatabaseEntry as use,
  useEntryPropertyMetadata as usePropertyMetadata,
  useDatabaseEntries as useAll,
  useDatabaseEntriesByIds as useByIds,
  useDatabaseEntryIds as useIds,
} from './DatabaseEntriesStore';
export { requestEntryFocus as requestFocus } from './requestEntryFocus';
export { useEntryFocusRequest as useFocusRequest } from './EntryFocusRequestStore';
export { resolveDatabaseEntryReference as resolveReference } from './utils';
export { resolveEntryPropertyFilePath as propertyFilePath } from './utils';
export { resolveEntryPropertyFiles as propertyFiles } from './utils';
export { resolveEntryIcon as resolveIcon } from './utils';
export { isEntryTitleTaken as isTitleTaken } from './utils';
export { isGloballyUniqueEntryTitle as isGloballyUniqueTitle } from './utils';
export { findDatabaseEntryByReference as findByReference } from './utils';
export { findEntryPropertyFileOwner as findPropertyFileOwner } from './utils';
export { validateDatabaseEntryTitle as validateTitle } from './validateDatabaseEntryTitle';
export { readDatabaseEntries as readFiles } from './readDatabaseEntries';
export { entryPropertyValues as propertyValues } from './utils';
export { getAllDatabaseEntries as getAll } from './getAllDatabaseEntries';
export { getTaggedDatabaseEntries as getTagged } from './getTaggedDatabaseEntries';
export { getNewestDatabaseEntries as getNewest } from './utils';
export { searchDatabaseEntryCreationOptions as searchCreationOptions } from './utils';
export { sortDatabaseEntries as sort } from './utils';
export { sortDatabaseEntryIds as sortIds } from './utils';
export { getRecentDatabaseEntries as getRecent } from './utils';
export { searchDatabaseEntriesByTitle as searchByTitle } from './utils';
export { resolveEntryColor as resolveColor } from './utils';
export { resolveEntryDatabaseValues as resolveDatabaseValues } from './utils';
export { useDatabaseEntryDesigns as useDesigns } from './useDatabaseEntryDesigns';
