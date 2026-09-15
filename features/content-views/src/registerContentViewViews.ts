import { ContentViews } from '@minddrop/content-views';
import { Views } from '@minddrop/views';
import { ContentViewView } from './ContentViewView';
import { ContentViewsView } from './ContentViewsView';
import { NewContentViewView } from './NewContentViewView';
import {
  ContentViewViewName,
  ContentViewsViewName,
  NewContentViewViewName,
} from './events';

/**
 * Registers the content views feature's views.
 */
export function registerContentViewViews(): void {
  // Register the single content view view
  Views.register({
    type: ContentViewViewName,
    component: ContentViewView,
    breadcrumbLevel: 'branch',
  });

  // Register the content views list view
  Views.register({
    type: ContentViewsViewName,
    component: ContentViewsView,
    title: 'contentViews.labels.views',
    icon: ContentViews.constants.Icon,
    breadcrumbLevel: 'root',
  });

  // Register the new content view view
  Views.register({
    type: NewContentViewViewName,
    component: NewContentViewView,
    breadcrumbLevel: 'branch',
  });
}
