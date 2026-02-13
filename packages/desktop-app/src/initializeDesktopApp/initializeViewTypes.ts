import { WallViewType } from '@minddrop/feature-wall-view';
import { ViewTypes } from '@minddrop/views';

export function initializeViewTypes() {
  // Register default view types
  [WallViewType].forEach(ViewTypes.register);
}
