import { DataViewType } from '@minddrop/data-views';
import { NotebookViewComponent } from './NotebookView';
import { NotebookViewOptionsMenu } from './NotebookViewOptionsMenu';
import { NotebookViewSkeleton } from './NotebookViewSkeleton';
import { defaultNotebookViewOptions } from './constants';
import { NotebookViewOptions } from './types';

export const NotebookViewType: DataViewType<NotebookViewOptions> = {
  type: 'notebook',
  name: 'dataViews.notebook.name',
  description: 'dataViews.notebook.description',
  icon: 'notebook-text',
  supportedDataSources: ['database', 'query', 'collection'],
  sortable: true,
  defaultOptions: defaultNotebookViewOptions,
  component: NotebookViewComponent,
  settingsMenu: NotebookViewOptionsMenu,
  skeletonComponent: NotebookViewSkeleton,
};
