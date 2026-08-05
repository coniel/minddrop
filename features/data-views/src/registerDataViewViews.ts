import { Views } from '@minddrop/views';
import { DataViewView } from './DataViewView';
import { DataViewsView } from './DataViewsView';
import { DataViewViewName, DataViewsViewName } from './events';

/**
 * Registers the data views feature's views.
 */
export function registerDataViewViews(): void {
  // Register the single data view view
  Views.register({ type: DataViewViewName, component: DataViewView });

  // Register the data views list view
  Views.register({ type: DataViewsViewName, component: DataViewsView });
}
