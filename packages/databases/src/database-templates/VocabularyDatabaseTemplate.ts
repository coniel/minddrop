import { DatabaseTemplateFn } from '../types';
import { TranslateFn, createI18n } from './database-template-utils';

/**
 * Creates the Vocabulary database template with translated strings.
 */
export const VocabularyDatabaseTemplate: DatabaseTemplateFn = (
  t: TranslateFn,
) => {
  const { naming, propertyName } = createI18n(t, 'vocabulary');

  // Helper to translate a part of speech option key
  const partOfSpeech = (key: string) =>
    t(`databases.templates.vocabulary.options.partOfSpeech.${key}`);

  return {
    ...naming,
    icon: 'content-icon:book-a:default',
    properties: [
      {
        type: 'text',
        name: propertyName('definition'),
        icon: 'content-icon:text:default',
      },
      {
        type: 'text',
        name: propertyName('exampleSentence'),
        icon: 'content-icon:quote:default',
      },
      {
        type: 'text',
        name: propertyName('language'),
        icon: 'content-icon:languages:default',
      },
      {
        type: 'select',
        name: propertyName('partOfSpeech'),
        icon: 'content-icon:tag:default',
        options: [
          { value: partOfSpeech('noun'), color: 'blue' },
          { value: partOfSpeech('verb'), color: 'green' },
          { value: partOfSpeech('adjective'), color: 'orange' },
          { value: partOfSpeech('adverb'), color: 'purple' },
          { value: partOfSpeech('pronoun'), color: 'pink' },
          { value: partOfSpeech('preposition'), color: 'cyan' },
          { value: partOfSpeech('conjunction'), color: 'yellow' },
          { value: partOfSpeech('interjection'), color: 'red' },
        ],
      },
    ],
  };
};
