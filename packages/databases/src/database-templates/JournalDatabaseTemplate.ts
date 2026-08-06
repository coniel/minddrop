import { createI18nKeyBuilder } from '@minddrop/i18n';
import { DatabaseTemplateFn } from '../types';

/**
 * Creates the Journal database template with translated strings.
 */
export const JournalDatabaseTemplate: DatabaseTemplateFn = (t) => {
  // Key builders for the template's i18n keys
  const key = createI18nKeyBuilder('databases.templates.journal.');
  const propertyKey = createI18nKeyBuilder(
    'databases.templates.journal.properties.',
  );

  // Key builder for the mood option keys
  const moodKey = createI18nKeyBuilder(
    'databases.templates.journal.options.mood.',
  );

  return {
    name: t(key('name')),
    entryName: t(key('entryName')),
    description: t(key('description')),
    icon: 'content-icon:book-heart:default',
    properties: [
      {
        type: 'date',
        name: t(propertyKey('date', 'name')),
        icon: 'content-icon:calendar:default',
      },
      {
        type: 'select',
        name: t(propertyKey('mood', 'name')),
        icon: 'content-icon:smile:default',
        options: [
          { value: t(moodKey('great')), color: 'green' },
          { value: t(moodKey('good')), color: 'blue' },
          { value: t(moodKey('okay')), color: 'yellow' },
          { value: t(moodKey('bad')), color: 'red' },
        ],
      },
      {
        type: 'formatted-text',
        name: t(propertyKey('content', 'name')),
        icon: 'content-icon:text-quote:default',
      },
      {
        type: 'created',
        name: t(propertyKey('created', 'name')),
        icon: 'content-icon:clock:default',
      },
    ],
  };
};
