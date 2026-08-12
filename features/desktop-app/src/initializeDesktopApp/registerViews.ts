import { registerCollectionViews } from '@minddrop/feature-collections';
import { registerDataViewViews } from '@minddrop/feature-data-views';
import { registerDatabaseViews } from '@minddrop/feature-databases';
import { registerDesignViews } from '@minddrop/feature-designs';
import { registerQueryViews } from '@minddrop/feature-queries';
import { registerSearchViews } from '@minddrop/feature-search';
import { registerSpaceViews } from '@minddrop/feature-spaces';

/**
 * Registers the views that can be opened by id via `OpenViewEvent`.
 */
export function registerViews(): void {
  // Register feature-provided views
  registerCollectionViews();
  registerDataViewViews();
  registerQueryViews();
  registerDatabaseViews();
  registerDesignViews();
  registerSearchViews();
  registerSpaceViews();
}
