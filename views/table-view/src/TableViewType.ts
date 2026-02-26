import { ViewType } from '@minddrop/views';
import { TableViewComponent } from './TableView';
import { defaultTableViewOptions } from './constants';
import { TableViewOptions } from './types';

export const TableViewType: ViewType<TableViewOptions> = {
  type: 'table',
  name: 'views.table.name',
  description: 'views.table.description',
  defaultOptions: defaultTableViewOptions,
  component: TableViewComponent,
};
