import { DatabaseTemplateFn } from '../types';
import { TranslateFn, createI18n } from './database-template-utils';

/**
 * Creates the Movies database template with translated strings.
 */
export const MoviesDatabaseTemplate: DatabaseTemplateFn = (t: TranslateFn) => {
  const { naming, propertyName } = createI18n(t, 'movies');

  // Helper to translate a genre option key
  const genre = (key: string) =>
    t(`databases.templates.movies.options.genre.${key}`);

  // Helper to translate a status option key
  const status = (key: string) =>
    t(`databases.templates.movies.options.status.${key}`);

  return {
    ...naming,
    icon: 'content-icon:clapperboard:default',
    properties: [
      {
        type: 'text',
        name: propertyName('director'),
        icon: 'content-icon:megaphone:default',
      },
      {
        type: 'select',
        name: propertyName('genre'),
        icon: 'content-icon:tag:default',
        options: [
          { value: genre('action'), color: 'red' },
          { value: genre('comedy'), color: 'yellow' },
          { value: genre('drama'), color: 'blue' },
          { value: genre('horror'), color: 'brown' },
          { value: genre('scienceFiction'), color: 'purple' },
          { value: genre('romance'), color: 'pink' },
          { value: genre('thriller'), color: 'orange' },
          { value: genre('documentary'), color: 'green' },
          { value: genre('animation'), color: 'cyan' },
          { value: genre('fantasy'), color: 'default' },
        ],
      },
      {
        type: 'select',
        name: propertyName('status'),
        icon: 'content-icon:circle-dot:default',
        options: [
          { value: status('toWatch'), color: 'default' },
          { value: status('watching'), color: 'blue' },
          { value: status('watched'), color: 'green' },
        ],
      },
      {
        type: 'number',
        name: propertyName('rating'),
        icon: 'content-icon:star:default',
      },
      {
        type: 'date',
        name: propertyName('releaseDate'),
        icon: 'content-icon:calendar:default',
      },
      {
        type: 'image',
        name: propertyName('poster'),
        icon: 'content-icon:image:default',
      },
    ],
  };
};
