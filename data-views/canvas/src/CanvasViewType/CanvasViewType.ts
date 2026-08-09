import { DataViewType } from '@minddrop/data-views';
import { CanvasViewComponent } from '../CanvasView';
import { CanvasViewOptionsMenu } from '../CanvasViewOptionsMenu';
import { CanvasViewSkeleton } from '../CanvasViewSkeleton';
import { defaultCanvasViewData } from '../constants';
import { CanvasViewData, CanvasViewOptions } from '../types';
import { mapNodeReferences } from '../utils';

export const CanvasViewType: DataViewType<CanvasViewOptions, CanvasViewData> = {
  type: 'canvas',
  name: 'dataViews.canvas.name',
  description: 'dataViews.canvas.description',
  icon: 'layout-dashboard',
  supportedDataSources: ['collection'],
  defaultData: defaultCanvasViewData,
  component: CanvasViewComponent,
  settingsMenu: CanvasViewOptionsMenu,
  skeletonComponent: CanvasViewSkeleton,
  serializeReferences: mapNodeReferences,
  resolveReferences: mapNodeReferences,
};
