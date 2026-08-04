import { DefaultViewName } from '@minddrop/events';
import { registerDatabaseViews } from '@minddrop/feature-databases';
import { registerDesignViews } from '@minddrop/feature-designs';
import { registerPageViews } from '@minddrop/feature-pages';
import { Views } from '@minddrop/views';
import { EmptyView } from '../EmptyView';

/**
 * Registers the views that can be opened by id via `OpenViewEvent`.
 */
export function registerViews(): void {
  // Register the blank default view
  Views.register({
    type: DefaultViewName,
    component: EmptyView,
  });

  // Register feature-provided views
  registerDatabaseViews();
  registerDesignViews();
  registerPageViews();
}
