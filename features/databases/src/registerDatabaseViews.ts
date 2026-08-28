import { SettingsViews } from '@minddrop/settings';
import { Views } from '@minddrop/views';
import { DatabaseDefaultsSettings } from './DatabaseDefaultsSettings';
import { DatabaseEntryPage } from './DatabaseEntryPage';
import { DatabaseView } from './DatabaseView';
import { DatabaseEntryViewName, DatabaseViewName } from './events';

/**
 * Registers the database feature's main content views so they can be
 * opened by id via `OpenViewEvent`, and its settings views.
 */
export function registerDatabaseViews(): void {
  Views.register({
    type: DatabaseViewName,
    component: DatabaseView,
    breadcrumbLevel: 'branch',
  });

  Views.register({
    type: DatabaseEntryViewName,
    component: DatabaseEntryPage,
    breadcrumbLevel: 'leaf',
  });

  // Register the global database preferences settings view
  SettingsViews.register({
    id: 'databases',
    label: 'databases.settings.label',
    description: 'databases.settings.description',
    icon: 'database',
    component: DatabaseDefaultsSettings,
  });
}
