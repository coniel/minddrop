import { NotebookViewType } from '@minddrop/notebook-view';
import { TableViewType } from '@minddrop/table-view';
import { BoardViewType } from '@minddrop/view-board';
import { GalleryViewType } from '@minddrop/view-gallery';
import { DataViewTypes } from '@minddrop/views';

export function initializeDataViewTypes() {
  // Register default view types
  DataViewTypes.register(BoardViewType);
  DataViewTypes.register(GalleryViewType);
  DataViewTypes.register(NotebookViewType);
  DataViewTypes.register(TableViewType);
}
