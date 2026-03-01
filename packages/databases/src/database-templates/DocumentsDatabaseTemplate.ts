import { DatabaseTemplateFn } from '../types';
import { TranslateFn, createI18n } from './database-template-utils';

/**
 * Creates the Documents database template with translated strings.
 */
export const DocumentsDatabaseTemplate: DatabaseTemplateFn = (
  t: TranslateFn,
) => {
  const { naming, propertyName } = createI18n(t, 'documents');

  // Helper to translate a category option key
  const category = (key: string) =>
    t(`databases.templates.documents.options.category.${key}`);

  return {
    ...naming,
    icon: 'content-icon:file-text:default',
    properties: [
      {
        type: 'file',
        name: propertyName('file'),
        icon: 'content-icon:file:default',
      },
      {
        type: 'text',
        name: propertyName('description'),
        icon: 'content-icon:text:default',
      },
      {
        type: 'select',
        name: propertyName('category'),
        icon: 'content-icon:tag:default',
        options: [
          { value: category('work'), color: 'blue' },
          { value: category('personal'), color: 'green' },
          { value: category('financial'), color: 'orange' },
          { value: category('legal'), color: 'red' },
          { value: category('medical'), color: 'pink' },
          { value: category('education'), color: 'purple' },
        ],
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
