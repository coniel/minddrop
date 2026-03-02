import { GalleryViewType } from '@minddrop/view-gallery';
import { TableViewType } from '@minddrop/table-view';
import { ViewTypes } from '@minddrop/views';

export function initializeViewTypes() {
  // Register default view types
  [GalleryViewType, TableViewType].forEach(ViewTypes.register);
}
