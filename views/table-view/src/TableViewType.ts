import { ViewType } from '@minddrop/views';
import { TableViewComponent } from './TableView';
import { TableViewOptionsMenu } from './TableViewOptionsMenu';
import { TableViewSkeleton } from './TableViewSkeleton';
import { defaultTableViewOptions } from './constants';
import { TableViewOptions } from './types';

export const TableViewType: ViewType<TableViewOptions> = {
  type: 'table',
  name: 'views.table.name',
  description: 'views.table.description',
  icon: 'table',
  supportedDataSources: ['database', 'query', 'collection'],
  defaultOptions: defaultTableViewOptions,
  component: TableViewComponent,
  skeletonComponent: TableViewSkeleton,
  settingsMenu: TableViewOptionsMenu,
};
