import { ViewPane } from './ViewPane.types';

/**
 * Where a view opens relative to the current one.
 */
export type ViewOpenMode =
  | 'in-place'
  | 'new-tab'
  | 'split'
  | 'dialog'
  | 'panel';

export interface BaseOpenViewEventData {
  /**
   * The id of the target view area. Defaults to the app's primary
   * view area when omitted.
   */
  viewAreaId?: string;

  /**
   * Where to open the view. Defaults to `in-place`, except where the
   * opened entity carries its own default.
   */
  openMode?: ViewOpenMode;

  /**
   * The pane the open was triggered from, which `in-place` opens
   * replace. Opens from outside a view area (e.g. the sidebar) leave
   * it unset and replace the view area as a whole.
   */
  sourcePane?: ViewPane;
}
