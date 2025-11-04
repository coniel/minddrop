export const OpenMainContentView = 'app:main-content:open';
export const OpenRightPanel = 'app:right-panel:open';
export const CloseRightPanel = 'app:right-panel:close';
export const OpenConfirmationDialog = 'app:confirmation-dialog:open';

export type OpenMainContentViewData<P = any> = {
  component: React.ComponentType<P>;
  props?: P;
};

export type OpenConfirmationDialogData = {
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
};
