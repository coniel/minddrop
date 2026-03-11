import { NotebookViewType } from '@minddrop/notebook-view';
import { TableViewType } from '@minddrop/table-view';
import { BoardViewType } from '@minddrop/view-board';
import { GalleryViewType } from '@minddrop/view-gallery';
import { ViewTypes } from '@minddrop/views';

export function initializeViewTypes() {
  // Register default view types
  [BoardViewType, GalleryViewType, NotebookViewType, TableViewType].forEach(
    ViewTypes.register,
  );
}
