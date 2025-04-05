import { useTranslation } from '@minddrop/i18n';
import { AlertDialog, Button, Group } from '@minddrop/ui-elements';

export interface ConfirmationDialogProps {
  /**
   * The content of the ConfirmationDialog.
   */
  children?: React.ReactNode;

  /**
   * The dialog title.
   */
  title?: React.ReactNode;

  /**
   * The dialog description.
   */
  description?: React.ReactNode;

  /**
   * The confirm button label.
   */
  confirmLabel?: string;

  /**
   * The cancel button label.
   */
  cancelLabel?: string;

  /**
   * Callback fired when the confirm button is clicked.
   */
  onConfirm?: () => void;

  /**
   * Callback fired when the cancel button is clicked.
   */
  onCancel?: () => void;

  /**
   * When true, the confirm button will be styled as a danger button.
   */
  danger?: boolean;

  /**
   * The translation prefix for the dialog title, description, and
   * button labels.
   */
  translationPrefix?: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  children,
  title,
  description,
  confirmLabel,
  cancelLabel,
  danger,
  onConfirm,
  onCancel,
  translationPrefix = '',
}) => {
  const { t } = useTranslation({ keyPrefix: translationPrefix });

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>{children}</AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>
          {typeof title === 'string' ? t(title) : title}
        </AlertDialog.Title>
        <AlertDialog.Description>
          {typeof description === 'string' ? t(description) : description}
        </AlertDialog.Description>
        <Group justify="flex-end" mt="xl">
          <AlertDialog.Cancel>
            <Button
              label={
                typeof cancelLabel === 'string'
                  ? t(cancelLabel)
                  : 'actions.cancel'
              }
              variant="text"
              onClick={onCancel}
            />
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              label={
                typeof confirmLabel === 'string'
                  ? t(confirmLabel)
                  : 'actions.confirm'
              }
              variant={danger ? 'danger' : 'contained'}
              onClick={onConfirm}
            />
          </AlertDialog.Action>
        </Group>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};
