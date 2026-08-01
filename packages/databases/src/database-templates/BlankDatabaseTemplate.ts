import { DatabaseTemplateFn } from '../types';
import { TranslateFn } from './database-template-utils';

/**
 * Creates the blank database template with only the title, created date,
 * and last modified date properties.
 */
export const BlankDatabaseTemplate: DatabaseTemplateFn = (t: TranslateFn) => ({
  name: 'databases.templates.blank.name',
  entryName: 'databases.templates.blank.entryName',
  description: 'databases.templates.blank.description',
  icon: 'content-icon:box:default',
  properties: [
    {
      type: 'title',
      name: t('properties.title.name'),
      icon: 'content-icon:type:default',
    },
    {
      type: 'created',
      name: t('properties.created.name'),
      icon: 'content-icon:clock:default',
    },
    {
      type: 'last-modified',
      name: t('properties.lastModified.name'),
      icon: 'content-icon:clock:default',
    },
  ],
});
