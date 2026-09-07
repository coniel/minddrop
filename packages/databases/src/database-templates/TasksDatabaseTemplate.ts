import { createI18nKeyBuilder } from '@minddrop/i18n';
import { DatabaseTemplateFn } from '../types';

/**
 * Creates the Tasks database template with translated strings.
 */
export const TasksDatabaseTemplate: DatabaseTemplateFn = (t) => {
  // Key builders for the template's i18n keys
  const key = createI18nKeyBuilder('databases.templates.tasks.');
  const propertyKey = createI18nKeyBuilder(
    'databases.templates.tasks.properties.',
  );

  // Key builder for the status option keys
  const statusKey = createI18nKeyBuilder(
    'databases.templates.tasks.options.status.',
  );

  // Key builder for the priority option keys
  const priorityKey = createI18nKeyBuilder(
    'databases.templates.tasks.options.priority.',
  );

  return {
    name: t(key('name')),
    entryName: t(key('entryName')),
    description: t(key('description')),
    icon: 'lucide:list-checks:default',
    properties: [
      {
        type: 'select',
        name: t(propertyKey('status', 'name')),
        icon: 'lucide:circle-dot:default',
        options: [
          { value: t(statusKey('toDo')), color: 'default' },
          { value: t(statusKey('inProgress')), color: 'blue' },
          { value: t(statusKey('done')), color: 'green' },
        ],
      },
      {
        type: 'select',
        name: t(propertyKey('priority', 'name')),
        icon: 'lucide:signal:default',
        options: [
          { value: t(priorityKey('low')), color: 'gray' },
          { value: t(priorityKey('medium')), color: 'yellow' },
          { value: t(priorityKey('high')), color: 'orange' },
          { value: t(priorityKey('urgent')), color: 'red' },
        ],
      },
      {
        type: 'date',
        name: t(propertyKey('dueDate', 'name')),
        icon: 'lucide:calendar:default',
      },
      {
        type: 'created',
        name: t(propertyKey('created', 'name')),
        icon: 'lucide:clock:default',
      },
      {
        type: 'last-modified',
        name: t(propertyKey('lastModified', 'name')),
        icon: 'lucide:clock:default',
      },
    ],
  };
};
