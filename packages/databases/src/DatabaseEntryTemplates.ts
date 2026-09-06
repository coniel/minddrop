import { DatabaseEntryTemplateNotFoundError } from './errors';
import {
  DatabaseEntryTemplateCreatedEvent,
  DatabaseEntryTemplateDeletedEvent,
  DatabaseEntryTemplateUpdatedEvent,
} from './events';

// Const-asserted so the names keep their literal types, which key
// the event data registry
export const events = {
  Created: DatabaseEntryTemplateCreatedEvent,
  Updated: DatabaseEntryTemplateUpdatedEvent,
  Deleted: DatabaseEntryTemplateDeletedEvent,
} as const;

export const errors = {
  NotFound: DatabaseEntryTemplateNotFoundError,
};

export { DatabaseEntryTemplatesStore as Store } from './DatabaseEntryTemplatesStore';
export { createDatabaseEntryTemplate as create } from './createDatabaseEntryTemplate';
export { getDatabaseEntryTemplate as get } from './getDatabaseEntryTemplate';
export { getDatabaseEntryTemplates as getAll } from './getDatabaseEntryTemplates';
export { loadDatabaseEntryTemplates as load } from './loadDatabaseEntryTemplates';
export { deleteDatabaseEntryTemplate as delete } from './deleteDatabaseEntryTemplate';
export { searchDatabaseEntryTemplates as search } from './utils';
export { updateDatabaseEntryTemplate as update } from './updateDatabaseEntryTemplate';
export { useDatabaseEntryTemplates as useAll } from './DatabaseEntryTemplatesStore';
export { writeDatabaseEntryTemplate as write } from './writeDatabaseEntryTemplate';
