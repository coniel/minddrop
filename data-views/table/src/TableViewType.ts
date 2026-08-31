import { DataViewType } from '@minddrop/data-views';
import { TableViewComponent } from './TableView';
import { TableViewOptionsMenu } from './TableViewOptionsMenu';
import { TableViewSkeleton } from './TableViewSkeleton';
import { defaultTableViewOptions } from './constants';
import { TableViewOptions } from './types';

export const TableViewType: DataViewType<TableViewOptions> = {
  type: 'table',
  name: 'dataViews.table.name',
  description: 'dataViews.table.description',
  icon: 'table',
  supportedDataSources: ['database', 'query', 'collection'],
  sortable: true,
  defaultOptions: defaultTableViewOptions,
  component: TableViewComponent,
  skeletonComponent: TableViewSkeleton,
  settingsMenu: TableViewOptionsMenu,
};
