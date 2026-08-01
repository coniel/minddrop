import { MainContentViews } from '@minddrop/views';
import { DatabaseEntryPage } from './DatabaseEntryPage';
import { DatabaseView } from './DatabaseView';
import { MainDatabaseEntryViewName, MainDatabaseViewName } from './events';

/**
 * Registers the database feature's main content views so they can be
 * opened by id via `OpenMainContentViewEvent`.
 */
export function registerDatabaseMainContentViews(): void {
  MainContentViews.register({
    type: MainDatabaseViewName,
    component: DatabaseView,
  });

  MainContentViews.register({
    type: MainDatabaseEntryViewName,
    component: DatabaseEntryPage,
  });
}
