import { ContentViewType } from '@minddrop/content-views';
import { GalleryViewComponent } from './GalleryView';
import { GalleryViewOptionsMenu } from './GalleryViewOptionsMenu/GalleryViewOptionsMenu';
import { GalleryViewSkeleton } from './GalleryViewSkeleton';
import { defaultGalleryViewOptions } from './constants';
import { GalleryViewOptions } from './types';

export const GalleryViewType: ContentViewType<GalleryViewOptions> = {
  type: 'gallery',
  name: 'contentViews.gallery.name',
  description: 'contentViews.gallery.description',
  icon: 'layout-grid',
  supportedDataSources: ['database', 'query', 'collection'],
  sortable: true,
  filterable: true,
  defaultOptions: defaultGalleryViewOptions,
  component: GalleryViewComponent,
  skeletonComponent: GalleryViewSkeleton,
  settingsMenu: GalleryViewOptionsMenu,
};
