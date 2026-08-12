import { ViewPane } from '@minddrop/events';

export interface ViewPaneLocation {
  /**
   * The id of the view area the view instance is rendered in.
   */
  viewAreaId: string;

  /**
   * The pane of the view area the view instance is rendered in.
   */
  pane: ViewPane;
}
