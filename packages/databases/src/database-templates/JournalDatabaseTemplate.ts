import { DatabaseTemplateFn } from '../types';
import { TranslateFn, createI18n } from './database-template-utils';

/**
 * Creates the Journal database template with translated strings.
 */
export const JournalDatabaseTemplate: DatabaseTemplateFn = (t: TranslateFn) => {
  const { naming, propertyName } = createI18n(t, 'journal');

  // Helper to translate a mood option key
  const mood = (key: string) =>
    t(`databases.templates.journal.options.mood.${key}`);

  return {
    ...naming,
    icon: 'content-icon:book-heart:default',
    properties: [
      {
        type: 'date',
        name: propertyName('date'),
        icon: 'content-icon:calendar:default',
      },
      {
        type: 'select',
        name: propertyName('mood'),
        icon: 'content-icon:smile:default',
        options: [
          { value: mood('great'), color: 'green' },
          { value: mood('good'), color: 'blue' },
          { value: mood('okay'), color: 'yellow' },
          { value: mood('bad'), color: 'red' },
        ],
      },
      {
        type: 'formatted-text',
        name: propertyName('content'),
        icon: 'content-icon:text-quote:default',
      },
      {
        type: 'created',
        name: propertyName('created'),
        icon: 'content-icon:clock:default',
      },
    ],
  };
};
