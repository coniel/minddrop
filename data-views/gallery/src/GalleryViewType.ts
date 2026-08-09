import { DataViewType } from '@minddrop/data-views';
import { GalleryViewComponent } from './GalleryView';
import { GalleryViewOptionsMenu } from './GalleryViewOptionsMenu/GalleryViewOptionsMenu';
import { GalleryViewSkeleton } from './GalleryViewSkeleton';
import { defaultGalleryViewOptions } from './constants';
import { GalleryViewOptions } from './types';

export const GalleryViewType: DataViewType<GalleryViewOptions> = {
  type: 'gallery',
  name: 'dataViews.gallery.name',
  description: 'dataViews.gallery.description',
  icon: 'layout-grid',
  supportedDataSources: ['database', 'query', 'collection'],
  defaultOptions: defaultGalleryViewOptions,
  component: GalleryViewComponent,
  skeletonComponent: GalleryViewSkeleton,
  settingsMenu: GalleryViewOptionsMenu,
};
