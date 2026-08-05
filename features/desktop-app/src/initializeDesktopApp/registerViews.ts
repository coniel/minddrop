import { DefaultViewName } from '@minddrop/events';
import { registerCollectionViews } from '@minddrop/feature-collections';
import { registerDataViewViews } from '@minddrop/feature-data-views';
import { registerDatabaseViews } from '@minddrop/feature-databases';
import { registerDesignViews } from '@minddrop/feature-designs';
import { registerQueryViews } from '@minddrop/feature-queries';
import { registerSpaceViews } from '@minddrop/feature-spaces';
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
  registerCollectionViews();
  registerDataViewViews();
  registerQueryViews();
  registerDatabaseViews();
  registerDesignViews();
  registerSpaceViews();
}
