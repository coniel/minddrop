import { AlertDialog } from '@base-ui/react/alert-dialog';
import { TranslationKey, useTranslation } from '@minddrop/i18n';
import { Button } from '../Button';
import { TranslatableNode } from '../types';
import './ConfirmationDialog.css';

export interface ConfirmationDialogProps extends AlertDialog.Root.Props {
  /*
   * Label for the confirm button. Can be an i18n key.
   */
  confirmLabel?: TranslationKey;

  /*
   * Plain string confirm label rendered as-is without i18n
   * translation. Takes priority over `confirmLabel`.
   */
  stringConfirmLabel?: string;

  /*
   * Label for the cancel button. Can be an i18n key.
   * @default 'actions.cancel'
   */
  cancelLabel?: TranslationKey;

  /*
   * Plain string cancel label rendered as-is without i18n
   * translation. Takes priority over `cancelLabel`.
   */
  stringCancelLabel?: string;

  /*
   * Dialog title. Accepts a string (i18n key) or a React node.
   */
  title?: TranslatableNode;

  /*
   * Plain string title rendered as-is without i18n translation.
   * Takes priority over `title`.
   */
  stringTitle?: string;

  /*
   * Dialog message body. Accepts a string (i18n key) or a React node.
   */
  message?: TranslatableNode;

  /*
   * Plain string message rendered as-is without i18n translation.
   * Takes priority over `message`.
   */
  stringMessage?: string;

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
  stringConfirmLabel,
  cancelLabel = 'actions.cancel',
  stringCancelLabel,
  title,
  stringTitle,
  message,
  stringMessage,
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
            {stringTitle ?? (typeof title === 'string' ? t(title) : title)}
          </AlertDialog.Title>
          <AlertDialog.Description className="confirmation-dialog-message">
            {stringMessage ??
              (typeof message === 'string' ? t(message) : message)}
          </AlertDialog.Description>
          <div className="confirmation-dialog-actions">
            <AlertDialog.Close
              render={
                <Button variant="filled" onClick={onCancel}>
                  {stringCancelLabel ?? t(cancelLabel)}
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
                  {stringConfirmLabel ?? (confirmLabel && t(confirmLabel))}
                </Button>
              }
            />
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};
