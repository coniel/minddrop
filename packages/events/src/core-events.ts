export const OpenMainContentViewEvent = 'app:main-content:open';
export const UpdateMainContentViewEvent = 'app:main-content:update';
export const CloseMainContentViewEvent = 'app:main-content:close';
export const SetMainContentEvent = 'app:main-content:set';
export const MainContentChangedEvent = 'app:main-content:changed';
export const MainContentReadyEvent = 'app:main-content:ready';
export const DefaultMainContentViewName = 'app:view:default';
export const OpenRightPanelEvent = 'app:right-panel:open';
export const CloseRightPanelEvent = 'app:right-panel:close';
export const OpenConfirmationDialogEvent = 'app:confirmation-dialog:open';
export const OpenAppSidebarEvent = 'app:sidebar:open';
export const CloseAppSidebarEvent = 'app:sidebar:close';
export const SetNavToolbarWidthEvent = 'app:nav-toolbar:set-width';
export const ToggleWindowFillEvent = 'app:window:toggle-fill';

export type OpenMainContentViewEventData<TProps = any> = {
  /**
   * Identifier for the view type being opened, following the
   * convention `[package]:view:[name]`. The component to render
   * is resolved from the registered main content views.
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
};

export type UpdateMainContentViewEventData<TProps = any> = {
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

export type CloseMainContentViewEventData = {
  /**
   * The instance id of the view to close.
   */
  id: string;
};

export type MainContentViewDescriptor<TProps = any> = {
  /**
   * Identifier for the view type, following the convention
   * `[package]:view:[name]`. The component is resolved from the
   * registered main content views.
   */
  view: string;

  /**
   * Unique id for this view instance, used to match the view for
   * later updates or closing.
   */
  id?: string;

  /**
   * Props passed to the view component.
   */
  props?: TProps;

  /**
   * Display title for the view, shown in its tab.
   */
  title?: string;

  /**
   * Display icon for the view as a serializable icon string, shown
   * in its tab.
   */
  icon?: string;
};

export type SetMainContentEventData = {
  /**
   * The view rendered in the main (left) pane, or null when empty.
   */
  main: MainContentViewDescriptor | null;

  /**
   * The view rendered in the split (right) pane, or null when
   * there is no split.
   */
  split: MainContentViewDescriptor | null;

  /**
   * The width of the main (left) pane as a percentage (0-100).
   */
  splitRatio: number;
};

/**
 * Payload of the main content changed event. Describes the full state
 * of the main content area (same shape as `SetMainContentEventData`).
 */
export type MainContentChangedEventData = SetMainContentEventData;

export type SetNavToolbarWidthEventData = {
  /**
   * Width in px the nav toolbar should adopt. A value of 0
   * collapses it to auto width.
   */
  width: number;
};

export type OpenConfirmationDialogEventData = {
  /**
   * The label for the confirmation button.
   */
  confirmLabel: string;

  /**
   * The label for the cancel button.
   * @default 'actions.cancel'
   */
  cancelLabel?: string;

  /**
   * The dialog title.
   */
  title: React.ReactNode | string;

  /**
   * The dialog message.
   */
  message: React.ReactNode | string;

  /**
   * When `true`, styles the confirmation button to indicate a dangerous action.
   * @default true
   */
  danger?: boolean;

  /**
   * The callback invoked when the user confirms the action.
   */
  onConfirm: () => void;

  /**
   * The callback invoked when the user cancels the action.
   */
  onCancel?: () => void;
};
