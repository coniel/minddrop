import { createI18nKeyBuilder } from '@minddrop/i18n';
import { DatabaseTemplateFn } from '../types';

/**
 * Creates the Projects database template with translated strings.
 */
export const ProjectsDatabaseTemplate: DatabaseTemplateFn = (t) => {
  // Key builders for the template's i18n keys
  const key = createI18nKeyBuilder('databases.templates.projects.');
  const propertyKey = createI18nKeyBuilder(
    'databases.templates.projects.properties.',
  );

  // Key builder for the status option keys
  const statusKey = createI18nKeyBuilder(
    'databases.templates.projects.options.status.',
  );

  // Key builder for the priority option keys
  const priorityKey = createI18nKeyBuilder(
    'databases.templates.projects.options.priority.',
  );

  return {
    name: t(key('name')),
    entryName: t(key('entryName')),
    description: t(key('description')),
    icon: 'content-icon:folder-kanban:default',
    properties: [
      {
        type: 'select',
        name: t(propertyKey('status', 'name')),
        icon: 'content-icon:circle-dot:default',
        options: [
          { value: t(statusKey('planning')), color: 'default' },
          { value: t(statusKey('active')), color: 'blue' },
          { value: t(statusKey('onHold')), color: 'yellow' },
          { value: t(statusKey('completed')), color: 'green' },
          { value: t(statusKey('archived')), color: 'gray' },
        ],
      },
      {
        type: 'select',
        name: t(propertyKey('priority', 'name')),
        icon: 'content-icon:signal:default',
        options: [
          { value: t(priorityKey('low')), color: 'gray' },
          { value: t(priorityKey('medium')), color: 'yellow' },
          { value: t(priorityKey('high')), color: 'orange' },
        ],
      },
      {
        type: 'date',
        name: t(propertyKey('startDate', 'name')),
        icon: 'content-icon:calendar:default',
      },
      {
        type: 'date',
        name: t(propertyKey('endDate', 'name')),
        icon: 'content-icon:calendar:default',
      },
      {
        type: 'formatted-text',
        name: t(propertyKey('description', 'name')),
        icon: 'content-icon:text-quote:default',
      },
      {
        type: 'created',
        name: t(propertyKey('created', 'name')),
        icon: 'content-icon:clock:default',
      },
      {
        type: 'last-modified',
        name: t(propertyKey('lastModified', 'name')),
        icon: 'content-icon:clock:default',
      },
    ],
  };
};
