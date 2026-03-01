import { DatabaseTemplateFn } from '../types';
import { TranslateFn, createI18n } from './database-template-utils';

/**
 * Creates the Projects database template with translated strings.
 */
export const ProjectsDatabaseTemplate: DatabaseTemplateFn = (
  t: TranslateFn,
) => {
  const { naming, propertyName } = createI18n(t, 'projects');

  // Helper to translate a status option key
  const status = (key: string) =>
    t(`databases.templates.projects.options.status.${key}`);

  // Helper to translate a priority option key
  const priority = (key: string) =>
    t(`databases.templates.projects.options.priority.${key}`);

  return {
    ...naming,
    icon: 'content-icon:folder-kanban:default',
    properties: [
      {
        type: 'select',
        name: propertyName('status'),
        icon: 'content-icon:circle-dot:default',
        options: [
          { value: status('planning'), color: 'default' },
          { value: status('active'), color: 'blue' },
          { value: status('onHold'), color: 'yellow' },
          { value: status('completed'), color: 'green' },
          { value: status('archived'), color: 'gray' },
        ],
      },
      {
        type: 'select',
        name: propertyName('priority'),
        icon: 'content-icon:signal:default',
        options: [
          { value: priority('low'), color: 'gray' },
          { value: priority('medium'), color: 'yellow' },
          { value: priority('high'), color: 'orange' },
        ],
      },
      {
        type: 'date',
        name: propertyName('startDate'),
        icon: 'content-icon:calendar:default',
      },
      {
        type: 'date',
        name: propertyName('endDate'),
        icon: 'content-icon:calendar:default',
      },
      {
        type: 'formatted-text',
        name: propertyName('description'),
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
