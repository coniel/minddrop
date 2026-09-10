import { DatabaseEntryEntityType } from './constants';
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
export { createDatabaseEntryFromTemplate as createFromTemplate } from './createDatabaseEntryFromTemplate';
export { getDatabaseEntry as get } from './getDatabaseEntry';
export { renameDatabaseEntry as rename } from './renameDatabaseEntry';
export { updateDatabaseEntry as update } from './updateDatabaseEntry';
export { clearDatabaseEntryProperty as clearProperty } from './clearDatabaseEntryProperty';
export { updateDatabaseEntryProperty as updateProperty } from './updateDatabaseEntryProperty';
export { setEntryColor as setColor } from './setEntryColor';
export { writeDatabaseEntry as write } from './writeDatabaseEntry';
export { readDatabaseEntry as read } from './readDatabaseEntry';
export {
  DatabaseEntriesStore as Store,
  useDatabaseEntry as use,
  useDatabaseEntries as useAll,
  useDatabaseEntriesByIds as useByIds,
  useDatabaseEntryIds as useIds,
} from './DatabaseEntriesStore';
export { resolveEntryPropertyFilePath as propertyFilePath } from './utils';
export { isEntryTitleTaken as isTitleTaken } from './utils';
export { isGloballyUniqueEntryTitle as isGloballyUniqueTitle } from './utils';
export { findDatabaseEntryByReference as findByReference } from './utils';
export { validateDatabaseEntryTitle as validateTitle } from './validateDatabaseEntryTitle';
export { readDatabaseEntries as readFiles } from './readDatabaseEntries';
export { createEntryVirtualViews as createVirtualViews } from './utils';
export { entryDisplayPropertyValues as displayPropertyValues } from './utils';
export { getAllDatabaseEntries as getAll } from './getAllDatabaseEntries';
export { getTaggedDatabaseEntries as getTagged } from './getTaggedDatabaseEntries';
export { getNewestDatabaseEntries as getNewest } from './utils';
export { sortDatabaseEntries as sort } from './utils';
export { sortDatabaseEntryIds as sortIds } from './utils';
export { getRecentDatabaseEntries as getRecent } from './utils';
export { searchDatabaseEntriesByTitle as searchByTitle } from './utils';
export { resolveEntryColor as resolveColor } from './utils';
export { resolveEntryLayoutOverrides as resolveLayoutOverrides } from './resolveEntryLayoutOverrides';
