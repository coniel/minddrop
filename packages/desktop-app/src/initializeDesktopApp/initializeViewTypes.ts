import { GalleryViewType } from '@minddrop/view-gallery';
import { ViewTypes } from '@minddrop/views';

export function initializeViewTypes() {
  // Register default view types
  [GalleryViewType].forEach(ViewTypes.register);
}
