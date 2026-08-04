import { DataViewType } from '@minddrop/views';
import { BoardViewComponent } from './BoardView';
import { BoardViewSkeleton } from './BoardViewSkeleton';
import { defaultBoardViewData } from './constants';
import { BoardViewData } from './types';

export const BoardViewType: DataViewType<object, BoardViewData> = {
  type: 'board',
  name: 'views.board.name',
  description: 'views.board.description',
  icon: 'columns-3',
  supportedDataSources: ['collection'],
  defaultData: defaultBoardViewData,
  component: BoardViewComponent,
  skeletonComponent: BoardViewSkeleton,
};
