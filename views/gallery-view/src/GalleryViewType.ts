import { ViewType } from '@minddrop/views';
import { GalleryViewComponent } from './GalleryView';
import { GalleryViewOptionsMenu } from './GalleryViewOptionsMenu/GalleryViewOptionsMenu';
import { GalleryViewSkeleton } from './GalleryViewSkeleton';
import { defaultGalleryViewOptions } from './constants';
import { GalleryViewOptions } from './types';

export const GalleryViewType: ViewType<GalleryViewOptions> = {
  type: 'gallery',
  name: 'views.gallery.name',
  description: 'views.gallery.description',
  icon: 'layout-grid',
  supportedDataSources: ['database', 'query', 'collection'],
  defaultOptions: defaultGalleryViewOptions,
  component: GalleryViewComponent,
  skeletonComponent: GalleryViewSkeleton,
  settingsMenu: GalleryViewOptionsMenu,
};
