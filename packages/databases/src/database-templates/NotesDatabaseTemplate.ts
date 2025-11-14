import { DatabaseTemplate } from '../types';

export const NotesDatabaseTemplate: DatabaseTemplate = {
  dataType: 'object',
  name: 'databaseTemplates.notes.name',
  entryName: 'databaseTemplates.notes.entryName',
  description: 'databaseTemplates.notes.description',
  icon: 'content-icon:pencil:default',
  color: 'gray',
  properties: [
    {
      type: 'text-formatted',
      name: 'databaseTemplates.notes.properties.content.name',
      icon: 'content-icon:text-quote:default',
    },
    {
      type: 'created',
      name: 'databaseTemplates.notes.properties.created.name',
      icon: 'content-icon:clock:default',
    },
    {
      type: 'last-modified',
      name: 'databaseTemplates.notes.properties.lastModified.name',
      icon: 'content-icon:clock:default',
    },
  ],
};
