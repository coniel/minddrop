import { NotebookViewType } from '@minddrop/notebook-view';
import { TableViewType } from '@minddrop/table-view';
import { GalleryViewType } from '@minddrop/view-gallery';
import { ViewTypes } from '@minddrop/views';

export function initializeViewTypes() {
  // Register default view types
  [GalleryViewType, NotebookViewType, TableViewType].forEach(
    ViewTypes.register,
  );
}
