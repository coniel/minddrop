import { BoardViewType } from '@minddrop/content-view-board';
import { CanvasViewType } from '@minddrop/content-view-canvas';
import { GalleryViewType } from '@minddrop/content-view-gallery';
import {
  KanbanViewType,
  initializeKanbanView,
} from '@minddrop/content-view-kanban';
import { NotebookViewType } from '@minddrop/content-view-notebook';
import { TableViewType } from '@minddrop/content-view-table';
import { ContentViewTypes } from '@minddrop/content-views';

export function initializeContentViewTypes() {
  // Register default view types
  ContentViewTypes.register(BoardViewType);
  ContentViewTypes.register(CanvasViewType);
  ContentViewTypes.register(GalleryViewType);
  ContentViewTypes.register(KanbanViewType);
  ContentViewTypes.register(NotebookViewType);
  ContentViewTypes.register(TableViewType);

  // Register the kanban view's event handlers
  initializeKanbanView();
}
