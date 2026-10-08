import { EntryEntityType, EntryTransferDataTypes } from './constants';
import { EntryFileUnparseableError, EntryNotFoundError } from './errors';
import {
  EntriesClearedEvent,
  EntryCreatedEvent,
  EntryDeletedEvent,
  EntryDuplicatedEvent,
  EntryRenamedEvent,
  EntryUpdatedEvent,
  EntryWrittenEvent,
  OpenEntryViewEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry.
export const events = {
  Created: EntryCreatedEvent,
  Updated: EntryUpdatedEvent,
  Deleted: EntryDeletedEvent,
  Renamed: EntryRenamedEvent,
  Written: EntryWrittenEvent,
  Duplicated: EntryDuplicatedEvent,
  Cleared: EntriesClearedEvent,
  OpenView: OpenEntryViewEvent,
} as const;

export const constants = {
  EntityType: EntryEntityType,
  TransferDataTypes: EntryTransferDataTypes,
};

export const errors = {
  NotFound: EntryNotFoundError,
  FileUnparseable: EntryFileUnparseableError,
};

export { createEntry as create } from './createEntry';
export { deleteEntry as delete } from './deleteEntry';
export { duplicateEntry as duplicate } from './duplicateEntry';
export { createEntryFromFilePath as createFromFilePath } from './createEntryFromFilePath';
export { createEntryFromFile as createFromFile } from './createEntryFromFile';
export { createEntryFromUrl as createFromUrl } from './createEntryFromUrl';
export { createEntriesFromTransferData as createFromTransferData } from './createEntriesFromTransferData';
export { createEntryFromTemplate as createFromTemplate } from './createEntryFromTemplate';
export { getEntry as get } from './getEntry';
export { renameEntry as rename } from './renameEntry';
export { updateEntry as update } from './updateEntry';
export { clearEntryProperty as clearProperty } from './clearEntryProperty';
export { updateEntryProperty as updateProperty } from './updateEntryProperty';
export { setEntryColor as setColor } from './setEntryColor';
export { getEntryPropertyMetadata as getPropertyMetadata } from './getEntryPropertyMetadata';
export { updateEntryPropertyMetadata as updatePropertyMetadata } from './updateEntryPropertyMetadata';
export { writeEntry as write } from './writeEntry';
export { readEntry as read } from './readEntry';
export {
  EntriesStore as Store,
  useEntry as use,
  useEntryPropertyMetadata as usePropertyMetadata,
  useEntries as useAll,
  useEntriesByIds as useByIds,
  useEntryIds as useIds,
} from './EntriesStore';
export { requestEntryFocus as requestFocus } from './requestEntryFocus';
export { useEntryFocusRequest as useFocusRequest } from './EntryFocusRequestStore';
export { resolveEntryReference as resolveReference } from './utils';
export { resolveEntryPropertyFilePath as propertyFilePath } from './utils';
export { resolveEntryPropertyFiles as propertyFiles } from './utils';
export { resolveEntryIcon as resolveIcon } from './utils';
export { isEntryTitleTaken as isTitleTaken } from './utils';
export { isGloballyUniqueEntryTitle as isGloballyUniqueTitle } from './utils';
export { findEntryByReference as findByReference } from './utils';
export { findEntryPropertyFileOwner as findPropertyFileOwner } from './utils';
export { validateEntryTitle as validateTitle } from './validateEntryTitle';
export { readEntries as readFiles } from './readEntries';
export { resolveEntryPropertyValues as resolvePropertyValues } from './utils';
export { getAllEntries as getAll } from './getAllEntries';
export { getTaggedEntries as getTagged } from './getTaggedEntries';
export { getNewestEntries as getNewest } from './utils';
export { searchEntryCreationOptions as searchCreationOptions } from './utils';
export { sortEntries as sort } from './utils';
export { sortEntryIds as sortIds } from './utils';
export { getRecentEntries as getRecent } from './utils';
export { searchEntriesByTitle as searchByTitle } from './utils';
export { resolveEntryColor as resolveColor } from './utils';
export { resolveEntryDatabaseValues as resolveDatabaseValues } from './utils';
export { useEntryDesigns as useDesigns } from './useEntryDesigns';
