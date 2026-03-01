import { DatabaseTemplateFn } from '../types';
import { TranslateFn, createI18n } from './database-template-utils';

/**
 * Creates the Music database template with translated strings.
 */
export const MusicDatabaseTemplate: DatabaseTemplateFn = (t: TranslateFn) => {
  const { naming, propertyName } = createI18n(t, 'music');

  // Helper to translate a genre option key
  const genre = (key: string) =>
    t(`databases.templates.music.options.genre.${key}`);

  return {
    ...naming,
    icon: 'content-icon:music:default',
    properties: [
      {
        type: 'file',
        name: propertyName('file'),
        icon: 'content-icon:music:default',
      },
      {
        type: 'text',
        name: propertyName('artist'),
        icon: 'content-icon:user:default',
      },
      {
        type: 'text',
        name: propertyName('album'),
        icon: 'content-icon:disc:default',
      },
      {
        type: 'select',
        name: propertyName('genre'),
        icon: 'content-icon:tag:default',
        options: [
          { value: genre('pop'), color: 'pink' },
          { value: genre('rock'), color: 'red' },
          { value: genre('hiphop'), color: 'purple' },
          { value: genre('electronic'), color: 'blue' },
          { value: genre('jazz'), color: 'orange' },
          { value: genre('classical'), color: 'brown' },
          { value: genre('rnb'), color: 'cyan' },
          { value: genre('country'), color: 'yellow' },
          { value: genre('metal'), color: 'gray' },
          { value: genre('folk'), color: 'green' },
        ],
      },
      {
        type: 'created',
        name: propertyName('created'),
        icon: 'content-icon:clock:default',
      },
    ],
  };
};
