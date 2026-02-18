import { DatabaseTemplate } from '../types';

export const BooksDatabaseTemplate: DatabaseTemplate = {
  entrySerializer: 'markdown',
  name: 'databaseTemplates.books.name',
  entryName: 'databaseTemplates.books.entryName',
  description: 'databaseTemplates.books.description',
  icon: 'content-icon:book-open-text:default',
  properties: [
    {
      type: 'text',
      name: 'databaseTemplates.books.properties.author.name',
      icon: 'content-icon:user:default',
    },
    {
      type: 'date',
      name: 'databaseTemplates.books.properties.publicationDate.name',
      icon: 'content-icon:calendar:default',
    },
    {
      type: 'text',
      name: 'databaseTemplates.books.properties.genre.name',
      icon: 'content-icon:tag:default',
    },
    {
      type: 'image',
      name: 'databaseTemplates.books.properties.coverImage.name',
      icon: 'content-icon:image:default',
      storage: 'asset',
    },
  ],
};
