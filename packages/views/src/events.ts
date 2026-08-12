import type {
  DefaultViewProps,
  ViewDescriptor,
} from './types/ViewDescriptor.types';
import type { ViewPane } from './types/ViewPane.types';

export const OpenViewEvent = 'app:view:open';
export const UpdateViewEvent = 'app:view:update';
export const CloseViewEvent = 'app:view:close';
export const SetViewAreaEvent = 'app:view-area:set';
export const ViewAreaChangedEvent = 'app:view-area:changed';
export const ViewAreaReadyEvent = 'app:view-area:ready';

export type OpenViewEventData<TProps = DefaultViewProps> = {
  /**
   * The id of the target view area. Defaults to the app's primary
   * view area when omitted.
   */
  viewAreaId?: string;

  /**
   * Identifier for the view type being opened, following the
   * convention `[package]:view:[name]`. The component to render
   * is resolved from the registered views.
   */
  view: string;

  /**
   * Unique id for this view instance, used to match the view for
   * later updates or closing (e.g. `databases:database:[id]`).
   */
  id?: string;

  /**
   * Props passed to the view component.
   */
  props?: TProps;

  /**
   * When true, renders in the split view panel instead
   * of replacing the main content.
   */
  split?: boolean;

  /**
   * The pane the open was triggered from, which is the pane replaced
   * when `split` is not set. Opens from outside a view area leave it
   * unset and replace the view area as a whole.
   */
  sourcePane?: ViewPane;

  /**
   * When opening a split view, the width of the left pane as a
   * percentage (0-100). Used to restore a persisted split ratio.
   */
  splitRatio?: number;

  /**
   * Display title for the view, shown in its tab.
   */
  title?: string;

  /**
   * Display icon for the view as a serializable icon string, shown
   * in its tab.
   */
  icon?: string;

  /**
   * Descriptors of the view's ancestor views, ordered root first.
   * Rendered as a breadcrumb trail by the opened view. Breadcrumb
   * descriptors never carry their own trails.
   */
  breadcrumbs?: ViewDescriptor[];
};

export type UpdateViewEventData<TProps = DefaultViewProps> = {
  /**
   * The id of the target view area. Defaults to the app's primary
   * view area when omitted.
   */
  viewAreaId?: string;

  /**
   * The instance id of the view to update.
   */
  id: string;

  /**
   * The view's new instance id, e.g. after a rename. When omitted the
   * id is unchanged.
   */
  newId?: string;

  /**
   * New props merged into the view (e.g. an updated id after a rename).
   */
  props?: TProps;

  /**
   * New display title for the view.
   */
  title?: string;

  /**
   * New display icon for the view.
   */
  icon?: string;
};

export type CloseViewEventData = {
  /**
   * The id of the target view area. Defaults to the app's primary
   * view area when omitted.
   */
  viewAreaId?: string;

  /**
   * The instance id of the view to close.
   */
  id: string;
};

export type SetViewAreaEventData = {
  /**
   * The id of the target view area.
   */
  viewAreaId: string;

  /**
   * The view rendered in the main (left) pane, or null when empty.
   */
  main: ViewDescriptor | null;

  /**
   * The view rendered in the split (right) pane, or null when
   * there is no split.
   */
  split: ViewDescriptor | null;

  /**
   * The width of the main (left) pane as a percentage (0-100).
   */
  splitRatio: number;
};

/**
 * Payload of the view area changed event. Describes the full state of
 * a view area (same shape as `SetViewAreaEventData`).
 */
export type ViewAreaChangedEventData = SetViewAreaEventData;

/**
 * Payload of the view area ready event, announced by a view area once
 * its listeners are attached.
 */
export type ViewAreaReadyEventData = {
  /**
   * The id of the view area that is ready.
   */
  viewAreaId: string;
};
