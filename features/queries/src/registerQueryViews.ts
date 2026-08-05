import { Views } from '@minddrop/views';
import { QueriesView } from './QueriesView';
import { QueriesViewName } from './events';

/**
 * Registers the queries feature's views.
 */
export function registerQueryViews(): void {
  // Register the queries list view
  Views.register({ type: QueriesViewName, component: QueriesView });
}
