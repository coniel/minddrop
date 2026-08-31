import { TagsIcon } from '@minddrop/tags';
import { Views } from '@minddrop/views';
import { TagsView } from './TagsView';
import { TagsViewName } from './events';

/**
 * Registers the tags feature's views.
 */
export function registerTagViews(): void {
  // Register the tags list view
  Views.register({
    type: TagsViewName,
    component: TagsView,
    title: 'tags.labels.tags',
    icon: TagsIcon,
    breadcrumbLevel: 'root',
  });
}
