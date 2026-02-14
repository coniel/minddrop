export const OpenMainContentViewEvent = 'app:main-content:open';
export const OpenRightPanelEvent = 'app:right-panel:open';
export const CloseRightPanelEvent = 'app:right-panel:close';
export const OpenConfirmationDialogEvent = 'app:confirmation-dialog:open';
export const OpenAppSidebarEvent = 'app:sidebar:open';
export const CloseAppSidebarEvent = 'app:sidebar:close';

export type OpenMainContentViewEventData<P = any> = {
  component: React.ComponentType<P>;
  props?: P;
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
