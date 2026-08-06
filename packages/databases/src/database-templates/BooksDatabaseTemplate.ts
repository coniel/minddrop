import { createI18nKeyBuilder } from '@minddrop/i18n';
import { DatabaseTemplateFn } from '../types';

/**
 * Creates the Books database template with translated strings.
 */
export const BooksDatabaseTemplate: DatabaseTemplateFn = (t) => {
  // Key builders for the template's i18n keys
  const key = createI18nKeyBuilder('databases.templates.books.');
  const propertyKey = createI18nKeyBuilder(
    'databases.templates.books.properties.',
  );

  // Key builder for the genre option keys
  const genreKey = createI18nKeyBuilder(
    'databases.templates.books.options.genre.',
  );

  // Key builder for the status option keys
  const statusKey = createI18nKeyBuilder(
    'databases.templates.books.options.status.',
  );

  return {
    name: t(key('name')),
    entryName: t(key('entryName')),
    description: t(key('description')),
    icon: 'content-icon:book-open-text:default',
    properties: [
      {
        type: 'text',
        name: t(propertyKey('author', 'name')),
        icon: 'content-icon:user:default',
      },
      {
        type: 'select',
        name: t(propertyKey('genre', 'name')),
        icon: 'content-icon:tag:default',
        options: [
          { value: t(genreKey('fiction')), color: 'blue' },
          { value: t(genreKey('nonFiction')), color: 'green' },
          { value: t(genreKey('scienceFiction')), color: 'purple' },
          { value: t(genreKey('fantasy')), color: 'pink' },
          { value: t(genreKey('mystery')), color: 'orange' },
          { value: t(genreKey('romance')), color: 'red' },
          { value: t(genreKey('thriller')), color: 'yellow' },
          { value: t(genreKey('horror')), color: 'brown' },
          { value: t(genreKey('biography')), color: 'cyan' },
          { value: t(genreKey('selfHelp')), color: 'gray' },
        ],
      },
      {
        type: 'select',
        name: t(propertyKey('status', 'name')),
        icon: 'content-icon:circle-dot:default',
        options: [
          { value: t(statusKey('toRead')), color: 'default' },
          { value: t(statusKey('reading')), color: 'blue' },
          { value: t(statusKey('finished')), color: 'green' },
          { value: t(statusKey('abandoned')), color: 'red' },
        ],
      },
      {
        type: 'number',
        name: t(propertyKey('rating', 'name')),
        icon: 'content-icon:star:default',
      },
      {
        type: 'date',
        name: t(propertyKey('publicationDate', 'name')),
        icon: 'content-icon:calendar:default',
      },
      {
        type: 'image',
        name: t(propertyKey('coverImage', 'name')),
        icon: 'content-icon:image:default',
      },
    ],
  };
};
