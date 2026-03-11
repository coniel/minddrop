import { ViewType } from '@minddrop/views';
import { BoardViewComponent } from './BoardView';
import { BoardViewSkeleton } from './BoardViewSkeleton';
import { defaultBoardViewOptions } from './constants';
import { BoardViewOptions } from './types';

export const BoardViewType: ViewType<BoardViewOptions> = {
  type: 'board',
  name: 'views.board.name',
  description: 'views.board.description',
  icon: 'columns-3',
  supportedDataSources: ['collection'],
  defaultOptions: defaultBoardViewOptions,
  component: BoardViewComponent,
  skeletonComponent: BoardViewSkeleton,
};
