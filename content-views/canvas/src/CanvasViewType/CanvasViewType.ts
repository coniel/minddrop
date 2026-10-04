import { ContentViewType } from '@minddrop/content-views';
import { CanvasViewComponent } from '../CanvasView';
import { CanvasViewOptionsMenu } from '../CanvasViewOptionsMenu';
import { CanvasViewSkeleton } from '../CanvasViewSkeleton';
import { defaultCanvasViewData } from '../constants';
import { locales } from '../locales';
import { CanvasViewData, CanvasViewOptions } from '../types';
import { mapDataReferences } from '../utils';

export const CanvasViewType: ContentViewType<
  CanvasViewOptions,
  CanvasViewData
> = {
  type: 'canvas',
  name: 'contentViews.canvas.name',
  description: 'contentViews.canvas.description',
  icon: 'layout-dashboard',
  locales,
  supportedDataSources: ['collection'],
  defaultData: defaultCanvasViewData,
  component: CanvasViewComponent,
  settingsMenu: CanvasViewOptionsMenu,
  skeletonComponent: CanvasViewSkeleton,
  serializeReferences: mapDataReferences,
  resolveReferences: mapDataReferences,
};
