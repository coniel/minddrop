import { ContentViewType } from '@minddrop/content-views';
import { BoardViewComponent } from './BoardView';
import { BoardViewOptionsMenu } from './BoardViewOptionsMenu';
import { BoardViewSkeleton } from './BoardViewSkeleton';
import { defaultBoardViewData } from './constants';
import { locales } from './locales';
import { BoardViewData, BoardViewOptions } from './types';
import { mapColumnReferences } from './utils';

export const BoardViewType: ContentViewType<BoardViewOptions, BoardViewData> = {
  type: 'board',
  name: 'contentViews.board.name',
  description: 'contentViews.board.description',
  icon: 'columns-3',
  locales,
  supportedDataSources: ['collection'],
  defaultData: defaultBoardViewData,
  component: BoardViewComponent,
  settingsMenu: BoardViewOptionsMenu,
  skeletonComponent: BoardViewSkeleton,
  serializeReferences: mapColumnReferences,
  resolveReferences: mapColumnReferences,
};
