import { createI18nKeyBuilder } from '@minddrop/i18n';
import { DatabaseTemplateFn } from '../types';

/**
 * Creates the Vocabulary database template with translated strings.
 */
export const VocabularyDatabaseTemplate: DatabaseTemplateFn = (t) => {
  // Key builders for the template's i18n keys
  const key = createI18nKeyBuilder('databases.templates.vocabulary.');
  const propertyKey = createI18nKeyBuilder(
    'databases.templates.vocabulary.properties.',
  );

  // Key builder for the part of speech option keys
  const partOfSpeechKey = createI18nKeyBuilder(
    'databases.templates.vocabulary.options.partOfSpeech.',
  );

  return {
    name: t(key('name')),
    entryName: t(key('entryName')),
    description: t(key('description')),
    icon: 'content-icon:book-a:default',
    properties: [
      {
        type: 'text',
        name: t(propertyKey('definition', 'name')),
        icon: 'content-icon:text:default',
      },
      {
        type: 'text',
        name: t(propertyKey('exampleSentence', 'name')),
        icon: 'content-icon:quote:default',
      },
      {
        type: 'text',
        name: t(propertyKey('language', 'name')),
        icon: 'content-icon:languages:default',
      },
      {
        type: 'select',
        name: t(propertyKey('partOfSpeech', 'name')),
        icon: 'content-icon:tag:default',
        options: [
          { value: t(partOfSpeechKey('noun')), color: 'blue' },
          { value: t(partOfSpeechKey('verb')), color: 'green' },
          { value: t(partOfSpeechKey('adjective')), color: 'orange' },
          { value: t(partOfSpeechKey('adverb')), color: 'purple' },
          { value: t(partOfSpeechKey('pronoun')), color: 'pink' },
          { value: t(partOfSpeechKey('preposition')), color: 'cyan' },
          { value: t(partOfSpeechKey('conjunction')), color: 'yellow' },
          { value: t(partOfSpeechKey('interjection')), color: 'red' },
        ],
      },
    ],
  };
};
