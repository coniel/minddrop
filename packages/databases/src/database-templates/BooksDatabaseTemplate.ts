import { DatabaseTemplateFn } from '../types';
import { TranslateFn, createI18n } from './database-template-utils';

/**
 * Creates the Books database template with translated strings.
 */
export const BooksDatabaseTemplate: DatabaseTemplateFn = (t: TranslateFn) => {
  const { naming, propertyName } = createI18n(t, 'books');

  // Helper to translate a genre option key
  const genre = (key: string) =>
    t(`databases.templates.books.options.genre.${key}`);

  // Helper to translate a status option key
  const status = (key: string) =>
    t(`databases.templates.books.options.status.${key}`);

  return {
    ...naming,
    icon: 'content-icon:book-open-text:default',
    properties: [
      {
        type: 'text',
        name: propertyName('author'),
        icon: 'content-icon:user:default',
      },
      {
        type: 'select',
        name: propertyName('genre'),
        icon: 'content-icon:tag:default',
        options: [
          { value: genre('fiction'), color: 'blue' },
          { value: genre('nonFiction'), color: 'green' },
          { value: genre('scienceFiction'), color: 'purple' },
          { value: genre('fantasy'), color: 'pink' },
          { value: genre('mystery'), color: 'orange' },
          { value: genre('romance'), color: 'red' },
          { value: genre('thriller'), color: 'yellow' },
          { value: genre('horror'), color: 'brown' },
          { value: genre('biography'), color: 'cyan' },
          { value: genre('selfHelp'), color: 'gray' },
        ],
      },
      {
        type: 'select',
        name: propertyName('status'),
        icon: 'content-icon:circle-dot:default',
        options: [
          { value: status('toRead'), color: 'default' },
          { value: status('reading'), color: 'blue' },
          { value: status('finished'), color: 'green' },
          { value: status('abandoned'), color: 'red' },
        ],
      },
      {
        type: 'number',
        name: propertyName('rating'),
        icon: 'content-icon:star:default',
      },
      {
        type: 'date',
        name: propertyName('publicationDate'),
        icon: 'content-icon:calendar:default',
      },
      {
        type: 'image',
        name: propertyName('coverImage'),
        icon: 'content-icon:image:default',
      },
    ],
  };
};
