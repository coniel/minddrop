import { DatabaseTemplate } from '../types';
import { createI18n } from './database-template-utils';

const { naming, propertyName } = createI18n('books');

export const BooksDatabaseTemplate: DatabaseTemplate = {
  entrySerializer: 'markdown',
  ...naming,
  icon: 'content-icon:book-open-text:default',
  properties: [
    {
      type: 'text',
      name: propertyName('author'),
      icon: 'content-icon:user:default',
    },
    {
      type: 'date',
      name: propertyName('publicationDate'),
      icon: 'content-icon:calendar:default',
    },
    {
      type: 'text',
      name: propertyName('genre'),
      icon: 'content-icon:tag:default',
    },
    {
      type: 'image',
      name: propertyName('coverImage'),
      icon: 'content-icon:image:default',
    },
  ],
};
