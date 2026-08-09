import { BoardViewType } from '@minddrop/data-view-board';
import { CanvasViewType } from '@minddrop/data-view-canvas';
import { GalleryViewType } from '@minddrop/data-view-gallery';
import { NotebookViewType } from '@minddrop/data-view-notebook';
import { TableViewType } from '@minddrop/data-view-table';
import { DataViewTypes } from '@minddrop/data-views';

export function initializeDataViewTypes() {
  // Register default view types
  DataViewTypes.register(BoardViewType);
  DataViewTypes.register(CanvasViewType);
  DataViewTypes.register(GalleryViewType);
  DataViewTypes.register(NotebookViewType);
  DataViewTypes.register(TableViewType);
}
