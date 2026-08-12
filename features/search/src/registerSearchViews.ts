import { DefaultViewName, Views } from '@minddrop/views';
import { SearchView } from './SearchView';

/**
 * Registers the search view as the app's default view, shown by
 * blank tabs and by panes split with search.
 */
export function registerSearchViews(): void {
  Views.register({
    type: DefaultViewName,
    component: SearchView,
    title: 'search.open',
    icon: 'search',
  });
}
