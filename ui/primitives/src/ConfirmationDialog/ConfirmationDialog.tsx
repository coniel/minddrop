import { AlertDialog } from '@base-ui/react/alert-dialog';
import { useTranslation } from '@minddrop/i18n';
import { Button } from '../Button';
import './ConfirmationDialog.css';

export interface ConfirmationDialogProps extends AlertDialog.Root.Props {
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
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  confirmLabel: confirmationLabel,
  onConfirm,
  onCancel,
  title,
  message: description,
  danger = false,
  cancelLabel = 'actions.cancel',
  ...other
}) => {
  const { t } = useTranslation();

  return (
    <AlertDialog.Root {...other}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="confirmation-dialog-backdrop">
          <AlertDialog.Popup className="panel confirmation-dialog">
            <AlertDialog.Title className="title">
              {typeof title === 'string' ? t(title) : title}
            </AlertDialog.Title>
            <AlertDialog.Description className="message">
              {typeof description === 'string' ? t(description) : description}
            </AlertDialog.Description>
            <div className="actions">
              <AlertDialog.Close
                render={
                  <Button
                    onClick={onCancel}
                    variant="contained"
                    label={cancelLabel}
                  />
                }
              />
              <AlertDialog.Close
                render={
                  <Button
                    variant="primary"
                    danger={danger ? 'always' : undefined}
                    label={confirmationLabel}
                    onClick={onConfirm}
                  />
                }
              />
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Backdrop>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
