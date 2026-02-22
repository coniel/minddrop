import { ViewType } from '@minddrop/views';
import { WallViewComponent } from './WallViewComponent';
import { defaultWallViewOptions } from './constants';
import { WallViewOptions } from './types';

export const WallViewType: ViewType<WallViewOptions> = {
  type: 'wall',
  name: 'views.wall.name',
  description: 'views.wall.description',
  defaultOptions: defaultWallViewOptions,
  component: WallViewComponent,
};
