import { ContentViewType } from '@minddrop/content-views';
import { TableViewComponent } from './TableView';
import { TableViewOptionsMenu } from './TableViewOptionsMenu';
import { TableViewSkeleton } from './TableViewSkeleton';
import { defaultTableViewOptions } from './constants';
import { locales } from './locales';
import { TableViewOptions } from './types';

export const TableViewType: ContentViewType<TableViewOptions> = {
  type: 'table',
  name: 'contentViews.table.name',
  description: 'contentViews.table.description',
  icon: 'table',
  locales,
  supportedDataSources: ['database', 'query', 'collection'],
  sortable: true,
  filterable: true,
  defaultOptions: defaultTableViewOptions,
  component: TableViewComponent,
  skeletonComponent: TableViewSkeleton,
  settingsMenu: TableViewOptionsMenu,
};
