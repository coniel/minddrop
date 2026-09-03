import { DataViewType } from '@minddrop/data-views';
import { KanbanViewComponent } from './KanbanView';
import { KanbanViewOptionsMenu } from './KanbanViewOptionsMenu';
import { KanbanViewSkeleton } from './KanbanViewSkeleton';
import { defaultKanbanViewData, defaultKanbanViewOptions } from './constants';
import { KanbanViewData, KanbanViewOptions } from './types';
import { mapOrderReferences } from './utils';

export const KanbanViewType: DataViewType<KanbanViewOptions, KanbanViewData> = {
  type: 'kanban',
  name: 'dataViews.kanban.name',
  description: 'dataViews.kanban.description',
  icon: 'square-kanban',
  supportedDataSources: ['database', 'query', 'collection'],
  defaultOptions: defaultKanbanViewOptions,
  defaultData: defaultKanbanViewData,
  component: KanbanViewComponent,
  settingsMenu: KanbanViewOptionsMenu,
  skeletonComponent: KanbanViewSkeleton,
  serializeReferences: mapOrderReferences,
  resolveReferences: mapOrderReferences,
};
