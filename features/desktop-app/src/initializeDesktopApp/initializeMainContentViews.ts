import { DefaultMainContentViewName } from '@minddrop/events';
import { registerDatabaseMainContentViews } from '@minddrop/feature-databases';
import { registerDesignMainContentViews } from '@minddrop/feature-designs';
import { MainContentViews } from '@minddrop/views';
import { EmptyMainContentView } from '../EmptyMainContentView';

/**
 * Registers the main content views that can be opened by id via
 * `OpenMainContentViewEvent`.
 */
export function initializeMainContentViews(): void {
  // Register the blank default view
  MainContentViews.register({
    type: DefaultMainContentViewName,
    component: EmptyMainContentView,
  });

  // Register feature-provided main content views
  registerDatabaseMainContentViews();
  registerDesignMainContentViews();
}
