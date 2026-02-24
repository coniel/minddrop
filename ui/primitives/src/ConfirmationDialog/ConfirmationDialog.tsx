import { AlertDialog } from '@base-ui/react/alert-dialog';
import { useTranslation } from '@minddrop/i18n';
import { Button } from '../Button';
import './ConfirmationDialog.css';

export interface ConfirmationDialogProps extends AlertDialog.Root.Props {
  /*
   * Label for the confirm button. Can be an i18n key.
   */
  confirmLabel: string;

  /*
   * Label for the cancel button. Can be an i18n key.
   * @default 'actions.cancel'
   */
  cancelLabel?: string;

  /*
   * Dialog title. Accepts a string (i18n key) or a React node.
   */
  title: React.ReactNode;

  /*
   * Dialog message body. Accepts a string (i18n key) or a React node.
   */
  message: React.ReactNode;

  /*
   * When true, styles the confirm button as a destructive action.
   * @default false
   */
  danger?: boolean;

  /*
   * Callback fired when the user confirms.
   */
  onConfirm: () => void;

  /*
   * Callback fired when the user cancels.
   */
  onCancel?: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  confirmLabel,
  cancelLabel = 'actions.cancel',
  title,
  message,
  danger = false,
  onConfirm,
  onCancel,
  ...other
}) => {
  const { t } = useTranslation();

  return (
    <AlertDialog.Root {...other}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="confirmation-dialog-backdrop" />
        <AlertDialog.Popup className="confirmation-dialog">
          <AlertDialog.Title className="confirmation-dialog-title">
            {typeof title === 'string' ? t(title) : title}
          </AlertDialog.Title>
          <AlertDialog.Description className="confirmation-dialog-message">
            {typeof message === 'string' ? t(message) : message}
          </AlertDialog.Description>
          <div className="confirmation-dialog-actions">
            <AlertDialog.Close
              render={
                <Button
                  variant="filled"
                  onClick={onCancel}
                >
                  {t(cancelLabel)}
                </Button>
              }
            />
            <AlertDialog.Close
              render={
                <Button
                  variant="solid"
                  color="primary"
                  danger={danger ? 'always' : undefined}
                  onClick={onConfirm}
                >
                  {t(confirmLabel)}
                </Button>
              }
            />
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
