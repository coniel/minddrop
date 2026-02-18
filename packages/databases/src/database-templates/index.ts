import { BooksDatabaseTemplate } from './BooksDatabaseTemplate';
import { NotesDatabaseTemplate } from './NotesDatabaseTemplate';

export * from './NotesDatabaseTemplate';
export * from './BooksDatabaseTemplate';
export * from './WeblinksDatabaseTemplate';

export const coreDatabaseTemplates = [
  NotesDatabaseTemplate,
  BooksDatabaseTemplate,
];
