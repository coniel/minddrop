import { DatabaseTemplateFn } from '../types';
import { TranslateFn, createI18n } from './database-template-utils';

/**
 * Creates the Tasks database template with translated strings.
 */
export const TasksDatabaseTemplate: DatabaseTemplateFn = (t: TranslateFn) => {
  const { naming, propertyName } = createI18n(t, 'tasks');

  // Helper to translate a status option key
  const status = (key: string) =>
    t(`databases.templates.tasks.options.status.${key}`);

  // Helper to translate a priority option key
  const priority = (key: string) =>
    t(`databases.templates.tasks.options.priority.${key}`);

  return {
    ...naming,
    icon: 'content-icon:list-checks:default',
    properties: [
      {
        type: 'select',
        name: propertyName('status'),
        icon: 'content-icon:circle-dot:default',
        options: [
          { value: status('toDo'), color: 'default' },
          { value: status('inProgress'), color: 'blue' },
          { value: status('done'), color: 'green' },
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
          { value: priority('urgent'), color: 'red' },
        ],
      },
      {
        type: 'date',
        name: propertyName('dueDate'),
        icon: 'content-icon:calendar:default',
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
