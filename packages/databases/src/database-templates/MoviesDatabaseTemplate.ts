import { createI18nKeyBuilder } from '@minddrop/i18n';
import { DatabaseTemplateFn } from '../types';

/**
 * Creates the Movies database template with translated strings.
 */
export const MoviesDatabaseTemplate: DatabaseTemplateFn = (t) => {
  // Key builders for the template's i18n keys
  const key = createI18nKeyBuilder('databases.templates.movies.');
  const propertyKey = createI18nKeyBuilder(
    'databases.templates.movies.properties.',
  );

  // Key builder for the genre option keys
  const genreKey = createI18nKeyBuilder(
    'databases.templates.movies.options.genre.',
  );

  // Key builder for the status option keys
  const statusKey = createI18nKeyBuilder(
    'databases.templates.movies.options.status.',
  );

  return {
    name: t(key('name')),
    entryName: t(key('entryName')),
    description: t(key('description')),
    icon: 'lucide:clapperboard:default',
    properties: [
      {
        type: 'text',
        name: t(propertyKey('director', 'name')),
        icon: 'lucide:megaphone:default',
      },
      {
        type: 'select',
        name: t(propertyKey('genre', 'name')),
        icon: 'lucide:tag:default',
        options: [
          { value: t(genreKey('action')), color: 'red' },
          { value: t(genreKey('comedy')), color: 'yellow' },
          { value: t(genreKey('drama')), color: 'blue' },
          { value: t(genreKey('horror')), color: 'brown' },
          { value: t(genreKey('scienceFiction')), color: 'purple' },
          { value: t(genreKey('romance')), color: 'pink' },
          { value: t(genreKey('thriller')), color: 'orange' },
          { value: t(genreKey('documentary')), color: 'green' },
          { value: t(genreKey('animation')), color: 'cyan' },
          { value: t(genreKey('fantasy')), color: 'default' },
        ],
      },
      {
        type: 'select',
        name: t(propertyKey('status', 'name')),
        icon: 'lucide:circle-dot:default',
        options: [
          { value: t(statusKey('toWatch')), color: 'default' },
          { value: t(statusKey('watching')), color: 'blue' },
          { value: t(statusKey('watched')), color: 'green' },
        ],
      },
      {
        type: 'number',
        name: t(propertyKey('rating', 'name')),
        icon: 'lucide:star:default',
      },
      {
        type: 'date',
        name: t(propertyKey('releaseDate', 'name')),
        icon: 'lucide:calendar:default',
      },
      {
        type: 'image',
        name: t(propertyKey('poster', 'name')),
        icon: 'lucide:image:default',
      },
    ],
  };
};
