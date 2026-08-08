import { DataViewType } from '@minddrop/data-views';
import { BoardViewComponent } from './BoardView';
import { BoardViewOptionsMenu } from './BoardViewOptionsMenu';
import { BoardViewSkeleton } from './BoardViewSkeleton';
import { defaultBoardViewData } from './constants';
import { BoardViewData, BoardViewOptions } from './types';
import { mapColumnReferences } from './utils';

export const BoardViewType: DataViewType<BoardViewOptions, BoardViewData> = {
  type: 'board',
  name: 'dataViews.board.name',
  description: 'dataViews.board.description',
  icon: 'columns-3',
  supportedDataSources: ['collection'],
  defaultData: defaultBoardViewData,
  component: BoardViewComponent,
  settingsMenu: BoardViewOptionsMenu,
  skeletonComponent: BoardViewSkeleton,
  serializeReferences: mapColumnReferences,
  resolveReferences: mapColumnReferences,
};
