import { ViewType } from '@minddrop/views';
import { GalleryViewComponent } from './GalleryView';
import { defaultGalleryViewOptions } from './constants';
import { GalleryViewOptions } from './types';

export const GalleryViewType: ViewType<GalleryViewOptions> = {
  type: 'gallery',
  name: 'views.gallery.name',
  description: 'views.gallery.description',
  icon: 'layout-grid',
  defaultOptions: defaultGalleryViewOptions,
  component: GalleryViewComponent,
};
