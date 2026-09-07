import { createI18nKeyBuilder } from '@minddrop/i18n';
import { DatabaseTemplateFn } from '../types';

/**
 * Creates the Notes database template with translated strings.
 */
export const NotesDatabaseTemplate: DatabaseTemplateFn = (t) => {
  // Key builders for the template's i18n keys
  const key = createI18nKeyBuilder('databases.templates.notes.');
  const propertyKey = createI18nKeyBuilder(
    'databases.templates.notes.properties.',
  );

  return {
    name: t(key('name')),
    entryName: t(key('entryName')),
    description: t(key('description')),
    icon: 'lucide:pencil:default',
    properties: [
      {
        type: 'content',
        name: t(propertyKey('content', 'name')),
        icon: 'lucide:text-quote:default',
      },
      {
        type: 'created',
        name: t(propertyKey('created', 'name')),
        icon: 'lucide:clock:default',
      },
      {
        type: 'last-modified',
        name: t(propertyKey('lastModified', 'name')),
        icon: 'lucide:clock:default',
      },
    ],
  };
};
