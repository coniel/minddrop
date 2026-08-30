import { DataViewsIcon } from '@minddrop/data-views';
import { Views } from '@minddrop/views';
import { DataViewView } from './DataViewView';
import { DataViewsView } from './DataViewsView';
import { NewDataViewView } from './NewDataViewView';
import {
  DataViewViewName,
  DataViewsViewName,
  NewDataViewViewName,
} from './events';

/**
 * Registers the data views feature's views.
 */
export function registerDataViewViews(): void {
  // Register the single data view view
  Views.register({
    type: DataViewViewName,
    component: DataViewView,
    breadcrumbLevel: 'branch',
  });

  // Register the data views list view
  Views.register({
    type: DataViewsViewName,
    component: DataViewsView,
    title: 'dataViews.labels.views',
    icon: DataViewsIcon,
    breadcrumbLevel: 'root',
  });

  // Register the new data view view
  Views.register({
    type: NewDataViewViewName,
    component: NewDataViewView,
    breadcrumbLevel: 'branch',
  });
}
