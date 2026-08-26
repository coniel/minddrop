import type { TranslationKey } from '@minddrop/i18n';

export const OpenRightPanelEvent = 'app:right-panel:open';
export const CloseRightPanelEvent = 'app:right-panel:close';
export const OpenConfirmationDialogEvent = 'app:confirmation-dialog:open';
export const OpenAppSidebarEvent = 'app:sidebar:open';
export const CloseAppSidebarEvent = 'app:sidebar:close';
export const SetNavToolbarWidthEvent = 'app:nav-toolbar:set-width';
export const SetNavToolbarBackActionEvent = 'app:nav-toolbar:set-back-action';
export const NavToolbarBackEvent = 'app:nav-toolbar:back';
export const ToggleWindowFillEvent = 'app:window:toggle-fill';
export const AppErrorEvent = 'app:error';
export const OpenReferenceEvent = 'app:reference:open';

export type OpenReferenceEventData = {
  /**
   * What is to be opened, as it was written in the link which points at it,
   * e.g. `Book` or `Books/Book`.
   *
   * The reference is deliberately unresolved: it is dispatched to the app at
   * large, and whichever package recognises it opens it. A reference which
   * nothing recognises opens nothing.
   */
  reference: string;
};

export type SetNavToolbarWidthEventData = {
  /**
   * Width in px the nav toolbar should adopt. A value of 0
   * collapses it to auto width.
   */
  width: number;
};

export type SetNavToolbarBackActionEventData = {
  /**
   * The label of the view-provided back action overriding the tab
   * history navigation. While set, the nav toolbar's back button
   * dispatches NavToolbarBackEvent instead of navigating.
   */
  label: TranslationKey;
} | null;

export type AppErrorEventData = {
  /**
   * The error title shown to the user.
   */
  title?: TranslationKey;

  /**
   * The user-facing error message.
   */
  message: TranslationKey;

  /**
   * The underlying error, when available.
   */
  error?: unknown;
};

export type OpenConfirmationDialogEventData = {
  /**
   * The label for the confirmation button.
   */
  confirmLabel: TranslationKey;

  /**
   * The label for the cancel button.
   * @default 'actions.cancel'
   */
  cancelLabel?: TranslationKey;

  /**
   * The dialog title. Strings are treated as i18n keys.
   */
  title: TranslationKey | React.ReactElement;

  /**
   * The dialog message. Strings are treated as i18n keys.
   */
  message: TranslationKey | React.ReactElement;

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

// The right panel open event's data is a view descriptor, so it is
// registered by the package which defines that type
declare module './types/EventDataMap.types' {
  interface EventDataMap {
    'app:right-panel:close': void;
    'app:confirmation-dialog:open': OpenConfirmationDialogEventData;
    'app:sidebar:open': void;
    'app:sidebar:close': void;
    'app:nav-toolbar:set-width': SetNavToolbarWidthEventData;
    'app:nav-toolbar:set-back-action': SetNavToolbarBackActionEventData;
    'app:nav-toolbar:back': void;
    'app:window:toggle-fill': void;
    'app:error': AppErrorEventData;
    'app:reference:open': OpenReferenceEventData;
  }
}
