import { i18n } from '@minddrop/i18n';
import { DatabaseTemplate } from '../types';

export const BooksDatabaseTemplate: DatabaseTemplate = {
  dataType: 'object',
  name: 'databaseTemplates.books.name',
  entryName: 'databaseTemplates.books.entryName',
  description: 'databaseTemplates.books.description',
  icon: 'content-icon:book-open-text:default',
  properties: [
    {
      type: 'text',
      name: i18n.t('databaseTemplates.books.properties.title.name'),
      icon: 'content-icon:user:default',
    },
    {
      type: 'date',
      name: i18n.t('databaseTemplates.books.properties.publicationDate.name'),
      icon: 'content-icon:calendar:default',
    },
    {
      type: 'text',
      name: i18n.t('databaseTemplates.books.properties.author.name'),
      icon: 'content-icon:tag:default',
    },
    {
      type: 'image',
      name: i18n.t('databaseTemplates.books.properties.coverImage.name'),
      icon: 'content-icon:image:default',
      storage: 'asset',
    },
  ],
};
