import { createI18nKeyBuilder } from '@minddrop/i18n';
import { DatabaseTemplateFn } from '../types';

/**
 * Creates the Documents database template with translated strings.
 */
export const DocumentsDatabaseTemplate: DatabaseTemplateFn = (t) => {
  // Key builders for the template's i18n keys
  const key = createI18nKeyBuilder('databases.templates.documents.');
  const propertyKey = createI18nKeyBuilder(
    'databases.templates.documents.properties.',
  );

  // Key builder for the category option keys
  const categoryKey = createI18nKeyBuilder(
    'databases.templates.documents.options.category.',
  );

  return {
    name: t(key('name')),
    entryName: t(key('entryName')),
    description: t(key('description')),
    icon: 'content-icon:file-text:default',
    properties: [
      {
        type: 'file',
        name: t(propertyKey('file', 'name')),
        icon: 'content-icon:file:default',
      },
      {
        type: 'text',
        name: t(propertyKey('description', 'name')),
        icon: 'content-icon:text:default',
      },
      {
        type: 'select',
        name: t(propertyKey('category', 'name')),
        icon: 'content-icon:tag:default',
        options: [
          { value: t(categoryKey('work')), color: 'blue' },
          { value: t(categoryKey('personal')), color: 'green' },
          { value: t(categoryKey('financial')), color: 'orange' },
          { value: t(categoryKey('legal')), color: 'red' },
          { value: t(categoryKey('medical')), color: 'pink' },
          { value: t(categoryKey('education')), color: 'purple' },
        ],
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
