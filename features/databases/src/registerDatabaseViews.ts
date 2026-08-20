import { Views } from '@minddrop/views';
import { DatabaseEntryPage } from './DatabaseEntryPage';
import { DatabaseView } from './DatabaseView';
import { DatabaseEntryViewName, DatabaseViewName } from './events';

/**
 * Registers the database feature's main content views so they can be
 * opened by id via `OpenViewEvent`.
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
}
