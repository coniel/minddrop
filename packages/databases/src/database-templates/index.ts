import { BooksDatabaseTemplate } from './BooksDatabaseTemplate';
import { NotesDatabaseTemplate } from './NotesDatabaseTemplate';

export * from './NotesDatabaseTemplate';
export * from './BooksDatabaseTemplate';

export const databaseTemplates = [NotesDatabaseTemplate, BooksDatabaseTemplate];
