import { ViewType } from '@minddrop/views';
import { NotebookViewComponent } from './NotebookView';
import { NotebookViewSkeleton } from './NotebookViewSkeleton';
import { defaultNotebookViewOptions } from './constants';
import { NotebookViewOptions } from './types';

export const NotebookViewType: ViewType<NotebookViewOptions> = {
  type: 'notebook',
  name: 'views.notebook.name',
  description: 'views.notebook.description',
  icon: 'notebook-text',
  supportedDataSources: ['database', 'query', 'collection'],
  defaultOptions: defaultNotebookViewOptions,
  component: NotebookViewComponent,
  skeletonComponent: NotebookViewSkeleton,
};
