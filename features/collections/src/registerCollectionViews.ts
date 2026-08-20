import { Views } from '@minddrop/views';
import { CollectionsView } from './CollectionsView';
import { CollectionsViewName } from './events';

/**
 * Registers the collections feature's views.
 */
export function registerCollectionViews(): void {
  // Register the collections list view
  Views.register({
    type: CollectionsViewName,
    component: CollectionsView,
    title: 'collections.labels.collections',
    icon: 'library',
    breadcrumbLevel: 'root',
  });
}
