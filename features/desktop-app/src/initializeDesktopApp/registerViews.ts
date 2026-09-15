import { registerCollectionViews } from '@minddrop/feature-collections';
import { registerContentViewViews } from '@minddrop/feature-content-views';
import { registerDatabaseViews } from '@minddrop/feature-databases';
import { registerDesignStudioViews } from '@minddrop/feature-designs';
import { registerQueryViews } from '@minddrop/feature-queries';
import { registerSearchViews } from '@minddrop/feature-search';
import { registerSpaceViews } from '@minddrop/feature-spaces';
import { registerTagViews } from '@minddrop/feature-tags';

/**
 * Registers the views that can be opened by id via `OpenViewEvent`.
 */
export function registerViews(): void {
  // Register feature-provided views
  registerCollectionViews();
  registerContentViewViews();
  registerQueryViews();
  registerDatabaseViews();
  registerDesignStudioViews();
  registerSearchViews();
  registerSpaceViews();
  registerTagViews();
}
