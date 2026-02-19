import { DatabaseTemplate } from '../types';
import { createI18n } from './database-template-utils';

const { naming, propertyName } = createI18n('notes');

export const NotesDatabaseTemplate: DatabaseTemplate = {
  entrySerializer: 'markdown',
  ...naming,
  icon: 'content-icon:pencil:default',
  properties: [
    {
      type: 'text-formatted',
      name: propertyName('content'),
      icon: 'content-icon:text-quote:default',
    },
    {
      type: 'created',
      name: propertyName('created'),
      icon: 'content-icon:clock:default',
    },
    {
      type: 'last-modified',
      name: propertyName('lastModified'),
      icon: 'content-icon:clock:default',
    },
  ],
};
