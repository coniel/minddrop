import { DataViewType } from '@minddrop/data-views';
import { BoardViewComponent } from './BoardView';
import { BoardViewSkeleton } from './BoardViewSkeleton';
import { defaultBoardViewData } from './constants';
import { BoardViewData } from './types';
import { mapColumnReferences } from './utils';

export const BoardViewType: DataViewType<object, BoardViewData> = {
  type: 'board',
  name: 'dataViews.board.name',
  description: 'dataViews.board.description',
  icon: 'columns-3',
  supportedDataSources: ['collection'],
  defaultData: defaultBoardViewData,
  component: BoardViewComponent,
  skeletonComponent: BoardViewSkeleton,
  serializeReferences: mapColumnReferences,
  resolveReferences: mapColumnReferences,
};
