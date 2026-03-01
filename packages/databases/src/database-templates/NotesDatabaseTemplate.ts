import { DatabaseTemplateFn } from '../types';
import { TranslateFn, createI18n } from './database-template-utils';

/**
 * Creates the Notes database template with translated strings.
 */
export const NotesDatabaseTemplate: DatabaseTemplateFn = (t: TranslateFn) => {
  const { naming, propertyName } = createI18n(t, 'notes');

  return {
    ...naming,
    icon: 'content-icon:pencil:default',
    properties: [
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
      {
        type: 'last-modified',
        name: propertyName('lastModified'),
        icon: 'content-icon:clock:default',
      },
    ],
  };
};
