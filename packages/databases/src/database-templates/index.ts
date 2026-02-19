import { BooksDatabaseTemplate } from './BooksDatabaseTemplate';
import { NotesDatabaseTemplate } from './NotesDatabaseTemplate';
import { WeblinksDatabaseTemplate } from './WeblinksDatabaseTemplate';

export * from './NotesDatabaseTemplate';
export * from './BooksDatabaseTemplate';
export * from './WeblinksDatabaseTemplate';

export const coreDatabaseTemplates = [
  NotesDatabaseTemplate,
  BooksDatabaseTemplate,
  WeblinksDatabaseTemplate,
];
