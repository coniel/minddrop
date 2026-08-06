import { createI18nKeyBuilder } from '@minddrop/i18n';
import { DatabaseTemplateFn } from '../types';

/**
 * Creates the blank database template with only the title, created date,
 * and last modified date properties.
 */
export const BlankDatabaseTemplate: DatabaseTemplateFn = (t) => {
  // Key builders for the template's naming and shared property keys
  const key = createI18nKeyBuilder('databases.templates.blank.');
  const propertyKey = createI18nKeyBuilder('properties.');

  return {
    name: t(key('name')),
    entryName: t(key('entryName')),
    description: t(key('description')),
    icon: 'content-icon:box:default',
    properties: [
      {
        type: 'title',
        name: t(propertyKey('title', 'name')),
        icon: 'content-icon:type:default',
      },
      {
        type: 'created',
        name: t(propertyKey('created', 'name')),
        icon: 'content-icon:clock:default',
      },
      {
        type: 'last-modified',
        name: t(propertyKey('lastModified', 'name')),
        icon: 'content-icon:clock:default',
      },
    ],
  };
};
