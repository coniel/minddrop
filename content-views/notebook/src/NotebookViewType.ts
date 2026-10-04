import { ContentViewType } from '@minddrop/content-views';
import { NotebookViewComponent } from './NotebookView';
import { NotebookViewOptionsMenu } from './NotebookViewOptionsMenu';
import { NotebookViewSkeleton } from './NotebookViewSkeleton';
import { defaultNotebookViewOptions } from './constants';
import { locales } from './locales';
import { NotebookViewOptions } from './types';

export const NotebookViewType: ContentViewType<NotebookViewOptions> = {
  type: 'notebook',
  name: 'contentViews.notebook.name',
  description: 'contentViews.notebook.description',
  icon: 'notebook-text',
  locales,
  supportedDataSources: ['database', 'query', 'collection'],
  sortable: true,
  filterable: true,
  defaultOptions: defaultNotebookViewOptions,
  component: NotebookViewComponent,
  settingsMenu: NotebookViewOptionsMenu,
  skeletonComponent: NotebookViewSkeleton,
};
